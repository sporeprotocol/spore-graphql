import { describe, it } from 'vitest';
import { predefinedSporeConfigs } from '@spore-sdk/core';
import { SporesDataSource } from '../data-sources/spores';

describe('SporeDataSource', () => {
  const config = predefinedSporeConfigs.Testnet;
  const dataSource = new SporesDataSource(config);

  it('Get SporeV1', async () => {
    const id = '0x95e5d57b6a9b2b35f26a8ade93e48ed736283ca2ca860654b809f8a1b9b8c8eb';
    const spores = await dataSource.getSporesFor([id, 'desc', 1]);
    console.log(spores);
  });
  it('Get SporeV2', async () => {
    const id = '0xdeade53312be714f15112f2becf64880dd6dbdc902ffb132203ec21eb01d22e7';
    const spores = await dataSource.getSporesFor([id, 'desc', 1]);
    console.log(spores);
  });
});
