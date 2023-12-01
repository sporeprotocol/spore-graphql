import {
  After,
  ClusterId,
  ContentType,
  First,
  Order,
} from '../data-sources/types';

export type BaseFilter = {
  address?: string;
  addresses?: string[];
};

export type SporeFilter = BaseFilter & {
  clusterIds?: ClusterId[];
  contentTypes?: ContentType[];
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
  filter: BaseFilter;
  after?: After;
};
