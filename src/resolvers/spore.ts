import { ContextValue } from '../context';
import { Spore, SporeLoadKey } from '../data-sources/types';
import { SporeQueryParams } from './types';
import { getQueryParams } from './utils';

/**
 * Get the spore by id
 */
export async function getSporeById(_: unknown, { id }: { id: string }, { dataSources }: ContextValue): Promise<Spore> {
  const spores = await dataSources.spores.getSporesFor([id, 'desc', 1]);
  const [spore] = spores;
  return spore;
}

/**
 * Get the spores
 */
export async function getSpores(_: unknown, params: SporeQueryParams, { dataSources }: ContextValue): Promise<Spore[]> {
  const { filter = {}, first, after, order } = getQueryParams(params);
  const { clusterIds, contentTypes, addresses } = filter ?? {};
  const key: SporeLoadKey = ['0x', order, first, after, clusterIds, contentTypes, addresses];
  return await dataSources.spores.getSporesFor(key);
}

/**
 * Get the count of spores
 */
export async function getSporeCount(
  _: unknown,
  params: SporeQueryParams,
  { dataSources }: ContextValue,
): Promise<number> {
  const { filter = {} } = getQueryParams(params);
  const { clusterIds, contentTypes, addresses } = filter ?? {};

  const key: SporeLoadKey = ['0x', 'desc', Number.MAX_SAFE_INTEGER, undefined, clusterIds, contentTypes, addresses];
  const spores = await dataSources.spores.getSporesFor(key);
  return spores.length;
}
