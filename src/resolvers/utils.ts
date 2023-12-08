import { BI, Cell } from '@ckb-lumos/lumos';
import { BaseQueryParams } from './types';
import { getCellCapacityMargin } from '@spore-sdk/core';

export function getQueryParams<P extends BaseQueryParams>(params: P) {
  const { first = 10, after, order = 'desc' } = params ?? {};
  return { ...params, first, after, order } as P;
}

export async function getCapacityMargin(cell: Cell | undefined) {
  if (!cell) {
    return BI.from('0').toHexString();
  }
  return getCellCapacityMargin(cell).toHexString();
}
