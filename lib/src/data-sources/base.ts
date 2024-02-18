import DataLoader from 'dataloader';
import combineAsyncIterators from 'combine-async-iterators';
import { Cell, CellCollector, Indexer } from '@ckb-lumos/lumos';
import { SporeConfig, SporeScriptCategory } from '@spore-sdk/core';
import { BaseCollectKeys, OptionalBaseCollectKeys } from './types';
import { hashKeys } from '../utils';

export abstract class BaseDataSource {
  public indexer: Indexer;
  public config: SporeConfig;

  abstract category: SporeScriptCategory;

  constructor(config: SporeConfig) {
    this.config = config;
    this.indexer = new Indexer(config.ckbNodeUrl, config.ckbIndexerUrl);
  }

  protected collector = new DataLoader(
    async (keyGroups: readonly BaseCollectKeys[]) => {
      return keyGroups.map((keys) => {
        const [codeHash, args = '0x', order = 'desc'] = keys;

        return this.indexer.collector({
          type: {
            codeHash,
            hashType: 'data1',
            args,
          },
          order,
        }) as CellCollector;
      });
    },
    {
      cacheKeyFn: (keys) => `collector-${hashKeys(keys)}`,
    },
  );

  async combineCollect(keys: OptionalBaseCollectKeys): Promise<AsyncIterableIterator<Cell>> {
    const [codeHash, args = '0x', order = 'desc'] = keys;
    if (codeHash) {
      const collector = await this.collector.load([codeHash, args, order]);
      return collector.collect();
    } else {
      const loading_collectors = this.category.versions.map((script) => {
        return this.collector.load([script.script.codeHash, args, order]);
      });
      let collectors = [];
      // FIXME: I assume all of cells under newer version are created after all of the older ones,
      //        if someone minted a cell after the new version contract deployed, this older cell
      //        will aslo be put in front of all the newer ones, fix me once it makes trouble
      for (const loading_await of loading_collectors) {
        collectors.push(await loading_await);
      }
      const collects = collectors.map((c) => c.collect());
      return combineAsyncIterators(...collects) as AsyncIterableIterator<Cell>;
    }
  }
}
