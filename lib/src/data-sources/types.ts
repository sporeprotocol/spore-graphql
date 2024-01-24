import { Cell } from '@ckb-lumos/lumos';

export type Order = 'asc' | 'desc';
export type First = number;
export type After = string;

export type SporeId = string;
export type ClusterId = string;
export type ContentType = string;
export type Address = string;

export type ClusterCollectKey = [ClusterId, Order];
export type ClusterLoadKey = [ClusterId, Order, First, After?, Address[]?, Address?];

export interface Cluster {
  id: ClusterId;
  name: string;
  description?: string;
  cell: Cell;
}

export type SporeCollectKey = [SporeId, Order];
export type SporeLoadKey = [SporeId, Order, First, After?, ClusterId[]?, ContentType[]?, Address[]?];

export interface Spore {
  id: SporeId;
  clusterId: string | undefined;
  contentType: string;
  content: string;
  cell: Cell;
}
