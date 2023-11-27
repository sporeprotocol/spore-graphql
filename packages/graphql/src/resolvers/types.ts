import {
  After,
  ClusterId,
  ContentType,
  First,
  Order,
} from '../data-sources/types';

export type SporeFilter = {
  clusterId?: ClusterId;
  contentType?: ContentType;
  address?: string;
};

export type ClusterFliter = {
  address?: string;
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
  filter: ClusterFliter;
};
