import DataLoader from 'dataloader';
import { Indexer } from '@ckb-lumos/lumos';
import {
  predefinedSporeConfigs,
  unpackToRawClusterData,
} from '@spore-sdk/core';
import { After, ClusterId, First, Order } from './types';

type ClusterCollectKey = [ClusterId, Order];
type ClusterLoadKey = [ClusterId, Order, First, After?];

export interface Cluster {
  id: ClusterId;
  name: string;
  description?: string;
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
      cacheKeyFn: (key) => {
        return `clustersCollector-${key.join('-')}`;
      },
    },
  );

  private clustersLoader = new DataLoader(
    (keys: readonly ClusterLoadKey[]) => {
      return Promise.all(
        keys.map(async ([id, order, first, after]) => {
          const collector = await this.clustersCollector.load([id, order]);

          let startCollect = !after;
          const clusters: Cluster[] = [];
          for await (const cell of collector.collect()) {
            const id = cell.cellOutput.type?.args ?? '0x';
            if (!startCollect) {
              startCollect = id === after;
              continue;
            }

            const rawClusterData = unpackToRawClusterData(cell.data);
            const cluster = {
              id: cell.cellOutput.type?.args ?? '0x',
              name: rawClusterData.name.toString(),
              description: rawClusterData.description?.toString(),
            };

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
      cacheKeyFn: (key) => {
        return `clustersLoader-${key.join('-')}`;
      },
    },
  );

  async getClustersFor(paramsKey: ClusterLoadKey) {
    return this.clustersLoader.load(paramsKey);
  }
}
