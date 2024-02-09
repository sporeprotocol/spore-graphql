import { groupBy } from 'lodash-es';
import { ContextValue } from '../context';
import { ClusterQueryParams, TopClusterQueryParams } from './types';
import { getQueryParams } from './utils';
import { helpers } from '@ckb-lumos/lumos';
import { isAnyoneCanPay, isSameScript } from '../utils';
import { Cluster, ClusterLoadKeys } from '../data-sources/types';

/**
 * Get the cluster by id
 */
export async function getClusterById(
  _: unknown,
  { id }: { id: string },
  { dataSources }: ContextValue,
): Promise<Cluster> {
  const key: ClusterLoadKeys = [id, 'desc', 1];
  const clusters = await dataSources.clusters.getClustersFor(key);
  const [cluster] = clusters;
  return cluster;
}

/**
 * Get the clusters
 */
export async function getClusters(
  _: unknown,
  params: ClusterQueryParams,
  { dataSources }: ContextValue,
): Promise<Cluster[]> {
  const { first, after, order, filter } = getQueryParams(params);
  const { addresses, mintableBy, codeHash } = filter ?? {};
  const key: ClusterLoadKeys = ['0x', order, first, after, addresses, mintableBy, codeHash];
  return await dataSources.clusters.getClustersFor(key);
}

/**
 * Get the top clusters by the number of spores
 */
export async function getTopClusters(
  _: unknown,
  params: TopClusterQueryParams,
  { dataSources }: ContextValue,
): Promise<Cluster[]> {
  const { first, after, filter } = getQueryParams(params);
  const { mintableBy, codeHash } = filter ?? {};
  const [spores, clusters] = await Promise.all([
    dataSources.spores.getSporesFor(['0x', 'desc', Number.MAX_SAFE_INTEGER, codeHash]),
    dataSources.clusters.getClustersFor([
      '0x',
      'desc',
      Number.MAX_SAFE_INTEGER,
      undefined,
      undefined,
      mintableBy,
      codeHash,
    ]),
  ]);
  const groupByCluster = groupBy(spores, 'clusterId');

  const topClusters = clusters.sort((a, b) => {
    const aSpores = groupByCluster[a.id] ?? [];
    const bSpores = groupByCluster[b.id] ?? [];
    return bSpores.length - aSpores.length;
  });

  const skip = after ? topClusters.findIndex((cluster) => cluster.id === after) + 1 : 0;
  const startIndex = skip > 0 ? skip + 1 : 0;
  const endIndex = startIndex + first;

  return topClusters.slice(startIndex, endIndex);
}

/**
 * Get the clusters that can be minted by the given address
 */
export async function getMintableClusters(
  _: unknown,
  { address, codeHash }: { address: string; codeHash?: string },
  { dataSources, config }: ContextValue,
): Promise<Cluster[]> {
  const key: ClusterLoadKeys = ['0x', 'desc', Number.MAX_SAFE_INTEGER, undefined, undefined, undefined, codeHash];
  const clusters = await dataSources.clusters.getClustersFor(key);
  const lock = helpers.parseAddress(address, {
    config: config.lumos,
  });

  return clusters.filter(({ cell }) => {
    return isSameScript(cell?.cellOutput.lock, lock) || isAnyoneCanPay(cell?.cellOutput.lock, config);
  });
}

/**
 * Get the count of clusters
 */
export async function getClusterCount(
  _: unknown,
  { codeHash }: { codeHash?: string },
  { dataSources }: ContextValue,
): Promise<number> {
  const key: ClusterLoadKeys = ['0x', 'desc', Number.MAX_SAFE_INTEGER, undefined, undefined, undefined, codeHash];
  const clusters = await dataSources.clusters.getClustersFor(key);
  return clusters.length;
}
