import { CellCollector, Indexer } from '@ckb-lumos/lumos';
import { SporeConfig } from '@spore-sdk/core';
import { ScriptId } from '@spore-sdk/core/lib/types';
import DataLoader from 'dataloader';
import { Order } from './types';

export abstract class BaseDataSource {
  public indexer: Indexer;
  public config: SporeConfig<string>;
  abstract script: ScriptId;

  constructor(config: SporeConfig<string>) {
    this.config = config;
    this.indexer = new Indexer(config.ckbNodeUrl, config.ckbIndexerUrl);
  }

  protected collector = new DataLoader(
    (keys: readonly [string, Order][]) => {
      return Promise.all(
        keys.map(async ([args, order]) => {
          const collector = this.indexer.collector({
            type: {
              ...this.script,
              args,
            },
            order,
          });
          return collector as CellCollector;
        }),
      );
    },
    {
      cacheKeyFn: (key) => `collector-${key.join('-')}`,
    },
  );
}
