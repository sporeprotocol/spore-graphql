import { ContextValue } from '../context';

type SporeFilter = {
  clusterId?: string;
  contentType?: string;
};

export type SporeQueryOptions = {
  filter: SporeFilter;
  first?: number;
  after?: string;
};

export async function getSpores(
  options: SporeQueryOptions,
  { dataSources }: ContextValue,
) {
  const { filter = {}, first = 20, after } = options ?? {};
  const { clusterId, contentType } = filter;
  const spores = await dataSources.spores.getSporesFor([
    '0x',
    'desc',
    first,
    after,
    clusterId,
    contentType,
  ]);
  return spores;
}

export async function getSporeById(id: string, { dataSources }: ContextValue) {
  const spores = await dataSources.spores.getSporesFor([id, 'desc', 1]);
  const [spore] = spores;
  return spore;
}
