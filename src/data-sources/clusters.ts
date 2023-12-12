import DataLoader from 'dataloader';
import { Address, Cell, Indexer, helpers } from '@ckb-lumos/lumos';
import { predefinedSporeConfigs, unpackToRawClusterData } from '@spore-sdk/core';
import { After, ClusterId, First, Order } from './types';
import { encodeToAddress } from './utils';
import { isAnyoneCanPay, isSameScript } from '../utils';

export type ClusterCollectKey = [ClusterId, Order];
export type ClusterLoadKey = [ClusterId, Order, First, After?, Address[]?, Address?];

export interface Cluster {
  id: ClusterId;
  name: string;
  description?: string;
  cell: Cell;
}

export class ClustersDataSource {
  private indexer: Indexer;
  private script = predefinedSporeConfigs.Aggron4.scripts.Cluster.script;

  constructor() {
    this.indexer = new Indexer(
      predefinedSporeConfigs.Aggron4.ckbIndexerUrl,
      predefinedSporeConfigs.Aggron4.ckbNodeUrl,
    );
  }

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

  private clustersCollector = new DataLoader(
    (keys: readonly ClusterCollectKey[]) => {
      return Promise.all(
        keys.map(async ([id, order]) => {
          const collector = this.indexer.collector({
            type: {
              ...this.script,
              args: id,
            },
            order: order,
          });
          return collector;
        }),
      );
    },
    {
      cacheKeyFn: (key) => `clustersCollector-${key.join('-')}`,
    },
  );

  private clustersLoader = new DataLoader(
    (keys: readonly ClusterLoadKey[]) => {
      this.clustersLoader.clearAll();
      return Promise.all(
        keys.map(async ([id, order, first, after, addresses, mintableBy]) => {
          const collector = await this.clustersCollector.load([id, order]);

          let startCollect = !after;
          const clusters: Cluster[] = [];
          for await (const cell of collector.collect()) {
            const id = cell.cellOutput.type?.args ?? '0x';
            if (!startCollect) {
              startCollect = id === after;
              continue;
            }

            const cluster = ClustersDataSource.getClusterFromCell(cell);

            if (
              addresses &&
              addresses.length > 0 &&
              !addresses.includes(encodeToAddress(cluster.cell.cellOutput.lock))
            ) {
              continue;
            }

            if (mintableBy) {
              const lock = helpers.parseAddress(mintableBy, {
                config: predefinedSporeConfigs.Aggron4.lumos,
              });
              const isMintable =
                isSameScript(cluster.cell.cellOutput.lock, lock) ||
                isAnyoneCanPay(cluster.cell.cellOutput.lock);
              if (!isMintable) {
                continue;
              }
            }

            clusters.push(cluster);
            if (clusters.length >= first) {
              break;
            }
          }
          return clusters;
        }),
      );
    },
    {
      cacheKeyFn: (key) => `clustersLoader-${key.join('-')}`,
    },
  );

  async getClustersFor(paramsKey: ClusterLoadKey) {
    return this.clustersLoader.load(paramsKey);
  }
}