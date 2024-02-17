import { Address, Hash } from '@ckb-lumos/lumos';
import { After, ClusterId, CodeHash, ContentType, First, Order } from '../data-sources/types';

export type BaseQueryFilter = {
  codeHash?: CodeHash;
  addresses?: Address[];
};

export type BaseQueryParams = {
  order: Order;
  first: First;
  after?: After;
};

export type SporesQueryParams = BaseQueryParams & {
  filter?: BaseQueryFilter & {
    clusterIds?: ClusterId[];
    contentTypes?: ContentType[];
  };
};

export type SingleQueryParams = {
  id: Hash;
  filter?: {
    codeHash?: CodeHash;
  };
};

export type ClustersQueryParams = BaseQueryParams & {
  filter?: BaseQueryFilter & {
    mintableBy?: Address;
  };
  after?: After;
};

export type TopClustersQueryParams = BaseQueryParams & {
  filter?: {
    mintableBy?: Address;
    codeHash?: CodeHash;
  };
};

export type MintableClustersQueryParams = {
  address: Address;
  filter?: {
    codeHash?: CodeHash;
  };
};

export type ClusterCountQueryParams = {
  filter?: {
    codeHash?: CodeHash;
  };
};
