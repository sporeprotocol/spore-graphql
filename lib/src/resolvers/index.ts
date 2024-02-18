import { ContextValue } from '../context';
import { getSporeById, getSporeCount, getSpores } from './spore';
import { getClusterById, getClusterCount, getClusters, getMintableClusters, getTopClusters } from './cluster';
import { ClustersQueryParams, SporesQueryParams } from './types';
import { getCapacityMargin } from './utils';
import { Cluster, Spore } from '../data-sources/types';

export const resolvers = {
  Query: {
    spore: getSporeById,
    spores: getSpores,
    sporeCount: getSporeCount,
    cluster: getClusterById,
    clusters: getClusters,
    topClusters: getTopClusters,
    mintableClusters: getMintableClusters,
    clusterCount: getClusterCount,
  },

  Spore: {
    cluster: async (spore: Spore, _: unknown, context: ContextValue) => {
      if (!spore.clusterId) {
        return null;
      }
      const params = {
        id: spore.clusterId,
      };
      return getClusterById(undefined, params, context);
    },

    capacityMargin: async (spore: Spore) => {
      return getCapacityMargin(spore.cell);
    },
  },

  Cluster: {
    spores: async (cluster: Cluster, args: ClustersQueryParams, context: ContextValue): Promise<Spore[]> => {
      const { first, after, order, filter } = args;
      const params = {
        filter: {
          clusterIds: [cluster.id],
          ...filter,
        },
        first: first ?? Number.MAX_SAFE_INTEGER,
        after,
        order,
      } as SporesQueryParams;
      return getSpores(undefined, params, context);
    },

    capacityMargin: async (cluster: Cluster) => {
      return getCapacityMargin(cluster.cell);
    },
  },
};
