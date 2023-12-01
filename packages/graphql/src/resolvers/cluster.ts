import { groupBy } from 'lodash-es';
import { ContextValue } from '../context';
import { Cluster, ClusterLoadKey } from '../data-sources/clusters';
import { ClusterQueryParams } from './types';
import { getQueryParams } from './utils';
import { SporeLoadKey } from '../data-sources/spores';

export async function getClusterById(
  _: unknown,
  { id }: { id: string },
  { dataSources }: ContextValue,
): Promise<Cluster> {
  const key: ClusterLoadKey = [id, 'desc', 1];
  const clusters = await dataSources.clusters.getClustersFor(key);
  const [cluster] = clusters;
  return cluster;
}

export async function getClusters(
  _: unknown,
  params: ClusterQueryParams,
  { dataSources }: ContextValue,
): Promise<Cluster[]> {
  const { first, after, order, filter } = getQueryParams(params);
  const { addresses } = filter ?? {};
  const key: ClusterLoadKey = ['0x', order, first, after, addresses];
  const clusters = await dataSources.clusters.getClustersFor(key);
  return clusters;
}

export async function getTopClusters(
  _: unknown,
  { first = Number.MAX_SAFE_INTEGER, after }: ClusterQueryParams,
  { dataSources }: ContextValue,
): Promise<Cluster[]> {
  const key: SporeLoadKey = ['0x', 'desc', Number.MAX_SAFE_INTEGER];
  const spores = await dataSources.spores.getSporesFor(key);

  const groupByCluster = groupBy(
    spores.filter((spore) => !!spore.clusterId),
    'clusterId',
  );

  const topClusterIds = Object.values(groupByCluster)
    .sort((a, b) => b.length - a.length)
    .map((spores) => spores[0].clusterId as string);

  const startIndex = after ? topClusterIds.indexOf(after) + 1 : 0;
  const endIndex = startIndex + first;

  const clusters = await Promise.all(
    topClusterIds.slice(startIndex, endIndex).map(async (id) => {
      const key: ClusterLoadKey = [id, 'desc', 1];
      const clusters = await dataSources.clusters.getClustersFor(key);
      const [cluster] = clusters;
      return cluster;
    }),
  );
  return clusters;
}

export async function getClusterCount(
  _: unknown,
  __: unknown,
  { dataSources }: ContextValue,
): Promise<number> {
  const key: ClusterLoadKey = [
    '0x',
    'desc',
    Number.MAX_SAFE_INTEGER,
    undefined,
  ];
  const clusters = await dataSources.clusters.getClustersFor(key);
  return clusters.length;
}
