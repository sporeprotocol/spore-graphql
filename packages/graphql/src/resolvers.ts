import { groupBy } from 'lodash-es';
import { ContextValue } from './context';
import { Cluster } from './data-sources/clusters';
import { Spore } from './data-sources/spores';
import {
  After,
  ClusterId,
  ContentType,
  First,
  Order,
} from './data-sources/types';

type SporeFilter = {
  clusterId?: ClusterId;
  contentType?: ContentType;
};

type BaseQueryParams = {
  order: Order;
  first: First;
  after?: After;
};

type SporeQueryParams = BaseQueryParams & {
  filter: SporeFilter;
};

function getQueryParams<P extends BaseQueryParams>(params: P) {
  const { first = 10, after, order = 'desc' } = params ?? {};
  return { ...params, first, after, order } as P;
}

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
      const { filter = {}, first, after, order } = getQueryParams(params);
      const { clusterId, contentType } = filter;
      const spores = await dataSources.spores.getSporesFor([
        '0x',
        order,
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
      const { filter = {} } = getQueryParams(params);
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
      const key = [id, 'desc', 1];
      const clusters = await dataSources.clusters.getClustersFor(key);
      const [cluster] = clusters;
      return cluster;
    },

    clusters: async (
      _: unknown,
      params: BaseQueryParams,
      { dataSources }: ContextValue,
    ): Promise<Cluster[]> => {
      const { first, after, order } = getQueryParams(params);
      const key = ['0x', order, first, after];
      const clusters = await dataSources.clusters.getClustersFor(key);
      return clusters;
    },

    topClusters: async (
      _: unknown,
      { first = Number.MAX_SAFE_INTEGER }: { first: number },
      { dataSources }: ContextValue,
    ): Promise<Cluster[]> => {
      const key = ['0x', 'desc', Number.MAX_SAFE_INTEGER];
      const spores = await dataSources.spores.getSporesFor(key);

      const groupByCluster = groupBy(
        spores.filter((spore) => !!spore.clusterId),
        'clusterId',
      );
      const topClusterIds = Object.values(groupByCluster)
        .sort((a, b) => b.length - a.length)
        .slice(0, first)
        .map((spores) => spores[0].clusterId);

      const clusters = await Promise.all(
        topClusterIds.map(async (id) => {
          const clusters = await dataSources.clusters.getClustersFor([
            id,
            'desc',
            1,
          ]);
          const [cluster] = clusters;
          return cluster;
        }),
      );
      return clusters;
    },

    clusterCount: async (
      _: unknown,
      __: unknown,
      { dataSources }: ContextValue,
    ): Promise<number> => {
      const key = ['0x', 'desc', Number.MAX_SAFE_INTEGER, undefined];
      const clusters = await dataSources.clusters.getClustersFor(key);
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

      const key = [spore.clusterId, 'desc', 1];
      const clusters = await dataSources.clusters.getClustersFor(key);
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
      const key = [
        '0x',
        'desc',
        Number.MAX_SAFE_INTEGER,
        undefined,
        cluster.id,
      ];
      const spores = await dataSources.spores.getSporesFor(key);
      return spores;
    },
  },
};
