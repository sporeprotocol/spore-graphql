import { Cell, Hash, HexString, Address } from '@ckb-lumos/lumos';

export type Order = 'asc' | 'desc';
export type First = number;
export type After = string;

export type CodeHash = Hash;
export type Args = HexString;
export type BaseCollectKeys = [CodeHash, Args?, Order?];
export type OptionalBaseCollectKeys = [CodeHash?, Args?, Order?];

export type ClusterId = Hash;
export type ClusterLoadKeys = [ClusterId, Order, First, After?, Address[]?, Address?, CodeHash?];
export interface Cluster {
  cell: Cell;
  id: ClusterId;
  codeHash: CodeHash;
  name: string;
  description?: string;
}

export type SporeId = Hash;
export type ContentType = string;
export type SporeLoadKeys = [SporeId, Order, First, After?, ClusterId[]?, ContentType[]?, Address[]?, CodeHash?];

export interface Spore {
  cell: Cell;
  id: SporeId;
  codeHash: CodeHash;
  clusterId: string | undefined;
  contentType: string;
  content: string;
}
