import { BaseQueryParams } from './types';

export function getQueryParams<P extends BaseQueryParams>(params: P) {
  const { first = 10, after, order = 'desc' } = params ?? {};
  return { ...params, first, after, order } as P;
}
