import DataLoader from 'dataloader';
import { Cell } from '@ckb-lumos/lumos';
import { getSporeScriptCategory, unpackToRawSporeData } from '@spore-sdk/core';
import { encodeToAddress, hashKeys } from '../utils';
import { ISporesDataSource } from './interface';
import { Spore, SporeLoadKeys } from './types';
import { BaseDataSource } from './base';

export class SporesDataSource extends BaseDataSource implements ISporesDataSource {
  public category = getSporeScriptCategory(this.config, 'Spore');

  public static getSporeFromCell(cell: Cell): Spore {
    const rawSporeData = unpackToRawSporeData(cell.data);
    return {
      cell,
      id: cell.cellOutput.type?.args ?? '0x',
      codeHash: cell.cellOutput.type!.codeHash,
      clusterId: rawSporeData.clusterId?.toString(),
      contentType: rawSporeData.contentType.toString(),
      content: rawSporeData.content.toString(),
    };
  }

  private sporesLoader = new DataLoader(
    (keyGroups: readonly SporeLoadKeys[]) => {
      return Promise.all(
        keyGroups.map(async (keys) => {
          const [id, order, first, after, clusterIds, contentTypes, addresses, codeHash] = keys;

          const collectIterator = await this.combineCollect([codeHash, id, order]);

          let startCollect = !after;
          const spores: Spore[] = [];
          for await (const cell of collectIterator) {
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
            if (clusterIds && spore.clusterId && clusterIds.length > 0 && !clusterIds.includes(spore.clusterId)) {
              continue;
            }

            // check the content type of the spore
            if (contentTypes && contentTypes.length > 0 && !contentTypes.includes(spore.contentType)) {
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
      cacheKeyFn: (keys) => {
        const seconds = Math.floor(Date.now() / 1000);
        return `spores-${hashKeys(keys)}-${seconds}`;
      },
    },
  );

  async getSporesFor(paramsKey: SporeLoadKeys) {
    return this.sporesLoader.load(paramsKey);
  }
}
