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
};

export type BaseQueryParams = {
  order: Order;
  first: First;
  after?: After;
};

export type SporeQueryParams = BaseQueryParams & {
  filter: SporeFilter;
};
