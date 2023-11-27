import { ContextValue } from '../context';
import { Spore, SporeLoadKey } from '../data-sources/spores';
import { SporeQueryParams } from './types';
import { getQueryParams } from './utils';

export async function getSporeById(
  _: unknown,
  { id }: { id: string },
  { dataSources }: ContextValue,
): Promise<Spore> {
  const spores = await dataSources.spores.getSporesFor([id, 'desc', 1]);
  const [spore] = spores;
  return spore;
}

export async function getSpores(
  _: unknown,
  params: SporeQueryParams,
  { dataSources }: ContextValue,
): Promise<Spore[]> {
  const { filter = {}, first, after, order } = getQueryParams(params);
  const { clusterId, contentType, address } = filter;
  const key: SporeLoadKey = ['0x', order, first, after, clusterId, contentType, address];
  const spores = await dataSources.spores.getSporesFor(key);
  return spores;
}

export async function getSporeCount(
  _: unknown,
  params: SporeQueryParams,
  { dataSources }: ContextValue,
): Promise<number> {
  const { filter = {} } = getQueryParams(params);
  const { clusterId, contentType, address } = filter;
  const key: SporeLoadKey = [
    '0x',
    'desc',
    Number.MAX_SAFE_INTEGER,
    undefined,
    clusterId,
    contentType,
    address,
  ];
  const spores = await dataSources.spores.getSporesFor(key);
  return spores.length;
}
