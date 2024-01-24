import { Cluster, ClusterLoadKey, Spore, SporeLoadKey } from './types';

export interface ISporesDataSource {
  getSporesFor(paramsKey: SporeLoadKey): Promise<Spore[]>;
}

export interface IClustersDataSource {
  getClustersFor(paramsKey: ClusterLoadKey): Promise<Cluster[]>;
}
