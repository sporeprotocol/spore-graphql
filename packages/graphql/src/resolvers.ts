import { ContextValue } from './context';
import { Spore } from './data-sources/spores';

type SporeFilter = {
  clusterId?: string;
  contentType?: string;
};

type BaseQueryOptions = {
  first?: number;
  after?: string;
};

type SporeQueryOptions = BaseQueryOptions & {
  filter: SporeFilter;
};

export const resolvers = {
  Query: {
    spore: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: ContextValue,
    ): Promise<Spore> => {
      const spores = await dataSources.spores.getSporesFor([id, 'desc', 1]);
      const [spore] = spores;
      return spore;
    },

    spores: async (
      _: unknown,
      options: SporeQueryOptions,
      { dataSources }: ContextValue,
    ): Promise<Spore[]> => {
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
    },

    sporeCount: async (
      _: unknown,
      options: SporeQueryOptions,
      { dataSources }: ContextValue,
    ): Promise<Spore[]> => {
      const { filter = {} } = options ?? {};
      const { clusterId, contentType } = filter;
      const spores = await dataSources.spores.getSporesFor([
        '0x',
        'desc',
        Number.MAX_SAFE_INTEGER,
        undefined,
        clusterId,
        contentType,
      ]);
      return spores.length;
    },

    cluster: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: ContextValue,
    ) => {
      const clusters = await dataSources.clusters.getClustersFor([
        id,
        'desc',
        1,
      ]);
      const [cluster] = clusters;
      return cluster;
    },

    clusters: async (
      _: unknown,
      options: BaseQueryOptions,
      { dataSources }: ContextValue,
    ) => {
      const { first = 20, after } = options ?? {};
      const clusters = await dataSources.clusters.getClustersFor([
        '0x',
        'desc',
        first,
        after,
      ]);
      return clusters;
    },

    clusterCount: async (
      _: unknown,
      options: BaseQueryOptions,
      { dataSources }: ContextValue,
    ) => {
      const clusters = await dataSources.clusters.getClustersFor([
        '0x',
        'desc',
        Number.MAX_SAFE_INTEGER,
        undefined,
      ]);
      return clusters.length;
    },
  },
};
