import DataLoader from 'dataloader';
import { Cell, helpers } from '@ckb-lumos/lumos';
import { unpackToRawClusterData, getSporeScriptCategory } from '@spore-sdk/core';
import { isAnyoneCanPay, isSameScript, hashKeys, ScriptEqualDeepCheck } from '../utils';
import { BaseDataSource } from './base';
import { IClustersDataSource } from './interface';
import { Cluster, ClusterLoadKeys } from './types';

export class ClustersDataSource extends BaseDataSource implements IClustersDataSource {
  public category = getSporeScriptCategory(this.config, 'Cluster');

  public static getClusterFromCell(cell: Cell): Cluster {
    const rawClusterData = unpackToRawClusterData(cell.data);
    return {
      cell,
      id: cell.cellOutput.type?.args ?? '0x',
      codeHash: cell.cellOutput.type!.codeHash,
      name: rawClusterData.name.toString(),
      description: rawClusterData.description?.toString(),
    };
  }

  private clustersLoader = new DataLoader(
    (keyGroups: readonly ClusterLoadKeys[]) => {
      return Promise.all(
        keyGroups.map(async (keys) => {
          const [id, order, first, after, addresses, mintableBy, codeHash] = keys;

          const collectIterator = await this.combineCollect([codeHash, id, order]);

          let startCollect = !after;
          const clusters: Cluster[] = [];
          for await (const cell of collectIterator) {
            const id = cell.cellOutput.type?.args ?? '0x';
            // skip the cells before the after id
            if (!startCollect) {
              startCollect = id === after;
              continue;
            }

            const cluster = ClustersDataSource.getClusterFromCell(cell);

            if (addresses && addresses.length > 0) {
              // check the address of the cluster
              const find = addresses
                .map((address) => helpers.parseAddress(address, { config: this.config.lumos }))
                .find((lock) => ScriptEqualDeepCheck(lock, cluster.cell.cellOutput.lock, this.config));
              if (find === void 0) {
                continue;
              }
            }

            // check the mintableBy of the cluster
            if (mintableBy) {
              const lock = helpers.parseAddress(mintableBy, {
                config: this.config.lumos,
              });
              // check the lock script of the cluster, only the same lock script or anyone-can-pay lock script is mintable
              const isMintable =
                isSameScript(cluster.cell.cellOutput.lock, lock) ||
                isAnyoneCanPay(cluster.cell.cellOutput.lock, this.config);
              if (!isMintable) {
                continue;
              }
            }

            clusters.push(cluster);
            // break the loop if the clusters length is enough
            if (clusters.length >= first) {
              break;
            }
          }
          return clusters;
        }),
      );
    },
    {
      cacheKeyFn: (keys) => {
        const seconds = Math.floor(Date.now() / 1000);
        return `clusters-${hashKeys(keys)}-${seconds}`;
      },
    },
  );

  async getClustersFor(paramsKey: ClusterLoadKeys) {
    return this.clustersLoader.load(paramsKey);
  }
}
