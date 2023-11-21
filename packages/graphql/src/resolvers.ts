import { ContextValue } from './context';
import { Cluster } from './data-sources/clusters';
import { Spore } from './data-sources/spores';

type SporeFilter = {
  clusterId?: string;
  contentType?: string;
};

type BaseQueryParams = {
  first?: number;
  after?: string;
};

type SporeQueryParams = BaseQueryParams & {
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
      params: SporeQueryParams,
      { dataSources }: ContextValue,
    ): Promise<Spore[]> => {
      const { filter = {}, first = 20, after } = params ?? {};
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
      params: SporeQueryParams,
      { dataSources }: ContextValue,
    ): Promise<number> => {
      const { filter = {} } = params ?? {};
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
    ): Promise<Cluster> => {
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
      params: BaseQueryParams,
      { dataSources }: ContextValue,
    ): Promise<Cluster[]> => {
      const { first = 20, after } = params ?? {};
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
      __: unknown,
      { dataSources }: ContextValue,
    ): Promise<number> => {
      const clusters = await dataSources.clusters.getClustersFor([
        '0x',
        'desc',
        Number.MAX_SAFE_INTEGER,
        undefined,
      ]);
      return clusters.length;
    },
  },

  Spore: {
    cluster: async (
      spore: Spore,
      _: unknown,
      { dataSources }: ContextValue,
    ) => {
      if (!spore.clusterId) {
        return null;
      }

      const clusters = await dataSources.clusters.getClustersFor([
        spore.clusterId,
        'desc',
        1,
      ]);
      const [cluster] = clusters;
      return cluster;
    },
  },

  Cluster: {
    spores: async (
      cluster: Cluster,
      _: unknown,
      { dataSources }: ContextValue,
    ): Promise<Spore[]> => {
      const spores = await dataSources.spores.getSporesFor([
        '0x',
        'desc',
        Number.MAX_SAFE_INTEGER,
        undefined,
        cluster.id,
      ]);
      return spores;
    },
  },
};
