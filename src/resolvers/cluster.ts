import { groupBy } from 'lodash-es';
import { ContextValue } from '../context';
import { Cluster, ClusterLoadKey } from '../data-sources/clusters';
import { ClusterQueryParams, TopClusterQueryParams } from './types';
import { getQueryParams } from './utils';
import { SporeLoadKey } from '../data-sources/spores';
import { helpers } from '@ckb-lumos/lumos';
import { predefinedSporeConfigs } from '@spore-sdk/core';
import { isAnyoneCanPay, isSameScript } from '../utils';

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
  const { addresses, mintableBy } = filter ?? {};
  const key: ClusterLoadKey = [
    '0x',
    order,
    first,
    after,
    addresses,
    mintableBy,
  ];
  const clusters = await dataSources.clusters.getClustersFor(key);
  return clusters;
}

export async function getTopClusters(
  _: unknown,
  params: TopClusterQueryParams,
  { dataSources }: ContextValue,
): Promise<Cluster[]> {
  const { first, after, filter } = getQueryParams(params);
  const { mintableBy } = filter ?? {};
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
    topClusterIds.map(async (id) => {
      const key: ClusterLoadKey = [
        id,
        'desc',
        1,
        undefined,
        undefined,
        mintableBy,
      ];
      const clusters = await dataSources.clusters.getClustersFor(key);
      const [cluster] = clusters;
      return cluster;
    }),
  );

  return clusters.filter((cluster) => !!cluster).slice(startIndex, endIndex);
}

export async function getMintableClusters(
  _: unknown,
  { address }: { address: string },
  { dataSources }: ContextValue,
): Promise<Cluster[]> {
  const key: ClusterLoadKey = ['0x', 'desc', Number.MAX_SAFE_INTEGER];
  const clusters = await dataSources.clusters.getClustersFor(key);
  const lock = helpers.parseAddress(address, {
    config: predefinedSporeConfigs.Aggron4.lumos,
  });
  const mintableClusters = clusters.filter(({ cell }) => {
    return (
      isSameScript(cell?.cellOutput.lock, lock) ||
      isAnyoneCanPay(cell?.cellOutput.lock)
    );
  });
  return mintableClusters;
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
