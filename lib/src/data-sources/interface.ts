import { Cluster, ClusterLoadKeys, Spore, SporeLoadKeys } from './types';

export interface ISporesDataSource {
  getSporesFor(paramsKey: SporeLoadKeys): Promise<Spore[]>;
}

export interface IClustersDataSource {
  getClustersFor(paramsKey: ClusterLoadKeys): Promise<Cluster[]>;
}
