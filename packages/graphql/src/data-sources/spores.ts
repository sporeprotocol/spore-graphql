import DataLoader from 'dataloader';
import { predefinedSporeConfigs, unpackToRawSporeData } from '@spore-sdk/core';
import { After, ClusterId, ContentType, First, Order, SporeId } from './types';
import { Indexer } from '@ckb-lumos/lumos';

type SporeCollectKey = [SporeId, Order];
type SporeLoadKey = [SporeId, Order, First, After?, ClusterId?, ContentType?];

export interface Spore {
  id: SporeId;
  clusterId: string | undefined;
  contentType: string;
  content: string;
}

export class SporesDataSource {
  private indexer: Indexer;
  private script = predefinedSporeConfigs.Aggron4.scripts.Spore.script;

  constructor() {
    this.indexer = new Indexer(
      predefinedSporeConfigs.Aggron4.ckbIndexerUrl,
      predefinedSporeConfigs.Aggron4.ckbNodeUrl,
    );
  }

  private sporesCollector = new DataLoader(
    (keys: readonly SporeCollectKey[]) => {
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
        return `sporesCollector-${key.join('-')}`;
      },
    },
  );

  sporesLoader = new DataLoader(
    (keys: readonly SporeLoadKey[]) => {
      return Promise.all(
        keys.map(async ([id, order, first, after, clusterId, contentType]) => {
          const collector = await this.sporesCollector.load([id, order]);

          let startCollect = !after;
          const spores: Spore[] = [];
          for await (const cell of collector.collect()) {
            const id = cell.cellOutput.type?.args ?? '0x';
            if (!startCollect) {
              startCollect = id === after;
              continue;
            }

            const rawSporeData = unpackToRawSporeData(cell.data);
            const spore = {
              id: cell.cellOutput.type?.args ?? '0x',
              clusterId: rawSporeData.clusterId?.toString(),
              contentType: rawSporeData.contentType.toString(),
              content: rawSporeData.content.toString(),
            };

            if (clusterId && spore.clusterId !== clusterId) {
              continue;
            }
            if (contentType && spore.contentType !== contentType) {
              continue;
            }

            spores.push(spore);
            if (spores.length >= first) {
              break;
            }
          }
          return spores;
        }),
      );
    },
    {
      cacheKeyFn: (key) => {
        return `sporesLoader-${key.join('-')}`;
      },
    },
  );

  async getSporesFor(paramsKey: SporeLoadKey) {
    return this.sporesLoader.load(paramsKey);
  }
}
