import DataLoader from 'dataloader';
import { getSporeScript, unpackToRawSporeData } from '@spore-sdk/core';
import { Cell } from '@ckb-lumos/lumos';
import { BaseDataSource } from './base';
import { ISporesDataSource } from './interface';
import { Spore, SporeLoadKey } from './types';
import { encodeToAddress } from '../utils';

export class SporesDataSource extends BaseDataSource implements ISporesDataSource {
  public script = getSporeScript(this.config, 'Spore').script;

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

  private sporesLoader = new DataLoader(
    (keys: readonly SporeLoadKey[]) => {
      return Promise.all(
        keys.map(async ([id, order, first, after, clusterIds, contentTypes, addresses]) => {
          const collector = await this.collector.load([id, order]);

          let startCollect = !after;
          const spores: Spore[] = [];
          for await (const cell of collector.collect()) {
            const id = cell.cellOutput.type?.args ?? '0x';
            // skip the cells before the after id
            if (!startCollect) {
              startCollect = id === after;
              continue;
            }

            const spore = SporesDataSource.getSporeFromCell(cell);

            // check the cluster id of the spore
            if (clusterIds && clusterIds.length > 0 && !spore.clusterId) {
              continue;
            }
            if (
              clusterIds &&
              spore.clusterId &&
              clusterIds.length > 0 &&
              !clusterIds.includes(spore.clusterId)
            ) {
              continue;
            }

            // check the content type of the spore
            if (
              contentTypes &&
              contentTypes.length > 0 &&
              !contentTypes.includes(spore.contentType)
            ) {
              continue;
            }

            // check the address of the spore
            if (
              addresses &&
              addresses.length > 0 &&
              !addresses.includes(encodeToAddress(spore.cell.cellOutput.lock, this.config))
            ) {
              continue;
            }

            spores.push(spore);
            // break the loop if the spores length is enough
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
        const seconds = Math.floor(Date.now() / 1000);
        return `spores-${key.join('-')}-${seconds}`;
      },
    },
  );

  async getSporesFor(paramsKey: SporeLoadKey) {
    return this.sporesLoader.load(paramsKey);
  }
}
