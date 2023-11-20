import DataLoader from 'dataloader';
import { Indexer } from '@ckb-lumos/lumos';
import { predefinedSporeConfigs, unpackToRawSporeData } from '@spore-sdk/core';

type SporeId = string;
type SporeOrder = 'asc' | 'desc';
type SporeLoadKey = [SporeId, SporeOrder];

interface Spore {
  id: SporeId;
  clusterId: string | undefined;
  contentType: string;
  content: string;
}

export class SporesDataSource {
  private indexer: Indexer;
  private script = predefinedSporeConfigs.Aggron4.scripts.Spore.script;

  constructor() {
    this.indexer = new Indexer(predefinedSporeConfigs.Aggron4.ckbIndexerUrl);
  }

  sporesLoader = new DataLoader(
    (keys: readonly SporeLoadKey[]) => {
      return Promise.all(
        keys.map(async ([id, order]) => {
          const collector = this.indexer.collector({
            type: {
              ...this.script,
              args: id,
            },
            order: order,
          });

          const spores: Spore[] = [];
          for await (const cell of collector.collect()) {
            const rawSporeData = unpackToRawSporeData(cell.data);
            const spore = {
              id: cell.cellOutput.type?.args ?? '0x',
              clusterId: rawSporeData.clusterId?.toString(),
              contentType: rawSporeData.contentType.toString(),
              content: rawSporeData.content.toString(),
            };
            spores.push(spore);
          }
          return spores;
        }),
      );
    },
    {
      cacheKeyFn: (key) => {
        return key.join('-');
      },
    },
  );

  async getSporesFor(paramsKey: SporeLoadKey) {
    return this.sporesLoader.load(paramsKey);
  }
}
