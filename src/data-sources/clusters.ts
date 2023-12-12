import DataLoader from 'dataloader';
import { Cell, helpers } from '@ckb-lumos/lumos';
import { unpackToRawClusterData } from '@spore-sdk/core';
import { encodeToAddress, isAnyoneCanPay, isSameScript } from '../utils';
import { BaseDataSource } from './base';
import { IClustersDataSource } from './interface';
import { Cluster, ClusterLoadKey } from './types';

export class ClustersDataSource extends BaseDataSource implements IClustersDataSource {
  public script = this.config.scripts.Cluster.script;

  public static getClusterFromCell(cell: Cell): Cluster {
    const rawClusterData = unpackToRawClusterData(cell.data);
    const cluster = {
      id: cell.cellOutput.type?.args ?? '0x',
      name: rawClusterData.name.toString(),
      description: rawClusterData.description?.toString(),
      cell,
    };
    return cluster;
  }

  private clustersLoader = new DataLoader(
    (keys: readonly ClusterLoadKey[]) => {
      return Promise.all(
        keys.map(async ([id, order, first, after, addresses, mintableBy]) => {
          const collector = await this.collector.load([id, order]);

          let startCollect = !after;
          const clusters: Cluster[] = [];
          for await (const cell of collector.collect()) {
            const id = cell.cellOutput.type?.args ?? '0x';
            // skip the cells before the after id
            if (!startCollect) {
              startCollect = id === after;
              continue;
            }

            const cluster = ClustersDataSource.getClusterFromCell(cell);

            // check the address of the cluster
            if (
              addresses &&
              addresses.length > 0 &&
              !addresses.includes(encodeToAddress(cluster.cell.cellOutput.lock, this.config))
            ) {
              continue;
            }

            // check the mintableBy of the cluster
            if (mintableBy) {
              const lock = helpers.parseAddress(mintableBy, {
                config: this.config.lumos,
              });
              // check the lock script of the cluster, only the same lock script or anyone-can-pay lock script is mintable
              const isMintable =
                isSameScript(cluster.cell.cellOutput.lock, lock) ||
                isAnyoneCanPay(cluster.cell.cellOutput.lock);
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
      cacheKeyFn: (key) => {
        const seconds = Math.floor(Date.now() / 1000);
        return `clusters-${key.join('-')}-${seconds}`;
      },
    },
  );

  async getClustersFor(paramsKey: ClusterLoadKey) {
    return this.clustersLoader.load(paramsKey);
  }
}
