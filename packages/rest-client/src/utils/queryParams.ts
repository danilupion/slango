import { AbortablePromise } from './abortableRequest.js';
import { Request } from './request.js';

export type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;
type QueryParamValue = boolean | null | number | string | undefined;

export const queryParamsToURLSearchParams = (query: QueryParams): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else if (value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });

  return params;
};

export const withQueryParams =
  <Query extends QueryParams>(query: Query) =>
  <Response, PromiseType extends AbortablePromise<Response> | Promise<Response>>(
    req: Request<Response, PromiseType>,
  ): Request<Response, PromiseType> =>
  (options = {}) => {
    return req({
      ...options,
      searchParams: queryParamsToURLSearchParams(query),
    });
  };
