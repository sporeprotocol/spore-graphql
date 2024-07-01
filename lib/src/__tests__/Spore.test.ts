import { describe, it, expect } from 'vitest';
import { predefinedSporeConfigs } from '@spore-sdk/core';
import { SporesDataSource } from '../data-sources/spores';

describe('SporeDataSource', () => {
  const config = predefinedSporeConfigs.Testnet;
  const dataSource = new SporesDataSource(config);

  it('Get SporeV1', async () => {
    const id = '0x95e5d57b6a9b2b35f26a8ade93e48ed736283ca2ca860654b809f8a1b9b8c8eb';
    const spores = await dataSource.getSporesFor([id, 'desc', 1]);
    expect(spores.length).toBe(1);
  });
  it('Get SporeV2', async () => {
    const id = '0xfa5c0998f04daf57d5804280edd37718d80f4c0f3ad1419f5195a291e8db9c9a';
    const spores = await dataSource.getSporesFor([id, 'desc', 1]);
    expect(spores.length).toBe(1);
  });
});
