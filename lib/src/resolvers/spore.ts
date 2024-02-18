import { ContextValue } from '../context';
import { Spore, SporeLoadKeys } from '../data-sources/types';
import { SingleQueryParams, SporesQueryParams } from './types';
import { getQueryParams } from './utils';

/**
 * Get the spore by id
 */
export async function getSporeById(
  _: unknown,
  { id, filter }: SingleQueryParams,
  { dataSources }: ContextValue,
): Promise<Spore> {
  const { codeHash } = filter ?? {};
  const key: SporeLoadKeys = [id, 'desc', 1, undefined, undefined, undefined, undefined, codeHash];
  const spores = await dataSources.spores.getSporesFor(key);
  const [spore] = spores;
  return spore;
}

/**
 * Get the spores
 */
export async function getSpores(
  _: unknown,
  params: SporesQueryParams,
  { dataSources }: ContextValue,
): Promise<Spore[]> {
  const { filter, first, after, order } = getQueryParams(params);
  const { clusterIds, contentTypes, addresses, codeHash } = filter ?? {};
  const key: SporeLoadKeys = ['0x', order, first, after, clusterIds, contentTypes, addresses, codeHash];
  return await dataSources.spores.getSporesFor(key);
}

/**
 * Get the count of spores
 */
export async function getSporeCount(
  _: unknown,
  params: SporesQueryParams,
  { dataSources }: ContextValue,
): Promise<number> {
  const { filter = {} } = getQueryParams(params);
  const { clusterIds, contentTypes, addresses, codeHash } = filter ?? {};

  const key: SporeLoadKeys = [
    '0x',
    'desc',
    Number.MAX_SAFE_INTEGER,
    undefined,
    clusterIds,
    contentTypes,
    addresses,
    codeHash,
  ];
  const spores = await dataSources.spores.getSporesFor(key);
  return spores.length;
}
