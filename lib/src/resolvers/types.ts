import { ScriptId } from '@spore-sdk/core/lib/types';
import { After, ClusterId, ContentType, First, Order } from '../data-sources/types';

export type BaseFilter = {
  scriptId?: ScriptId;
  address?: string;
  addresses?: string[];
};

export type SporeFilter = BaseFilter & {
  clusterIds?: ClusterId[];
  contentTypes?: ContentType[];
};

export type ClusterFilter = BaseFilter & {
  mintableBy?: string;
};

export type BaseQueryParams = {
  order: Order;
  first: First;
  after?: After;
};

export type SporeQueryParams = BaseQueryParams & {
  filter: SporeFilter;
};

export type ClusterQueryParams = BaseQueryParams & {
  filter: ClusterFilter;
  after?: After;
};

export type TopClusterQueryParams = BaseQueryParams & {
  filter: {
    mintableBy?: string;
  };
};
