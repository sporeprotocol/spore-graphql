import { ContextValue } from '../context';
import { Cluster } from '../data-sources/clusters';
import { Spore } from '../data-sources/spores';
import {
  getSporeById,
  getSporeCapacityMargin,
  getSporeCount,
  getSpores,
} from './spore';
import {
  getClusterById,
  getClusterCount,
  getClusters,
  getTopClusters,
} from './cluster';
import { SporeQueryParams } from './types';

export const resolvers = {
  Query: {
    spore: getSporeById,
    spores: getSpores,
    sporeCount: getSporeCount,
    cluster: getClusterById,
    clusters: getClusters,
    topClusters: getTopClusters,
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

    capacityMargin: getSporeCapacityMargin,
  },

  Cluster: {
    spores: async (
      cluster: Cluster,
      args: { first?: number },
      context: ContextValue,
    ): Promise<Spore[]> => {
      const params = {
        filter: {
          clusterId: cluster.id,
        },
        first: args.first ?? Number.MAX_SAFE_INTEGER,
      } as SporeQueryParams;
      return getSpores(undefined, params, context);
    },
  },
};
