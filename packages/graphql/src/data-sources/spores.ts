import DataLoader from 'dataloader';
import { predefinedSporeConfigs, unpackToRawSporeData } from '@spore-sdk/core';
import {
  Address,
  After,
  ClusterId,
  ContentType,
  First,
  Order,
  SporeId,
} from './types';
import { Cell, Indexer } from '@ckb-lumos/lumos';
import { encodeToAddress } from './utils';

export type SporeCollectKey = [SporeId, Order];
export type SporeLoadKey = [
  SporeId,
  Order,
  First,
  After?,
  ClusterId?,
  ContentType?,
  Address?,
];

export interface Spore {
  id: SporeId;
  clusterId: string | undefined;
  contentType: string;
  content: string;
  cell: Cell;
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

  public static getSporeFromCell(cell: Cell): Spore {
    const rawSporeData = unpackToRawSporeData(cell.data);
    const spore = {
      id: cell.cellOutput.type?.args ?? '0x',
      clusterId: rawSporeData.clusterId?.toString(),
      contentType: rawSporeData.contentType.toString(),
      content: rawSporeData.content.toString(),
      cell,
    };
    return spore;
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
            order,
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
        keys.map(
          async ([
            id,
            order,
            first,
            after,
            clusterId,
            contentType,
            address,
          ]) => {
            const collector = await this.sporesCollector.load([id, order]);

            let startCollect = !after;
            const spores: Spore[] = [];
            for await (const cell of collector.collect()) {
              const id = cell.cellOutput.type?.args ?? '0x';
              if (!startCollect) {
                startCollect = id === after;
                continue;
              }

              const spore = SporesDataSource.getSporeFromCell(cell);

              if (clusterId && spore.clusterId !== clusterId) {
                continue;
              }
              if (contentType && spore.contentType !== contentType) {
                continue;
              }
              if (
                address &&
                encodeToAddress(spore.cell.cellOutput.lock) !== address
              ) {
                continue;
              }

              spores.push(spore);
              if (spores.length >= first) {
                break;
              }
            }
            return spores;
          },
        ),
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
