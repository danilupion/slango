import { runPostResponse, runPreRequest } from '../middleware/runner.js';
import { AbortablePromise } from './abortableRequest.js';
import { BaseURL, getDefaultBaseUrl } from './baseUrl.js';
import { HttpError } from './HttpError.js';
import { HttpMethod } from './httpMethod.js';

type PathOnly = `../${string}` | `./${string}` | `/${string}`;

export type RequestURL = BaseURL | PathOnly;

export type Request<
  Response,
  PromiseType extends AbortablePromise<Response> | Promise<Response>,
> = (options?: RequestOptionsWithoutUrl) => PromiseType;

export type RequestOptions = RequestInit & {
  searchParams?: URLSearchParams;
  url: RequestURL;
  baseUrl?: BaseURL;
};

export type RequestOptionsWithoutUrl = Omit<RequestOptions, 'url'>;

export const request = async <Response>(
  method: HttpMethod,
  options: RequestOptions,
): Promise<Response> => {
  const fetchOptions = {
    method,
    ...options,
  };
  const middlewareContext = { request: fetchOptions };
  await runPreRequest(middlewareContext);

  const { searchParams, url, baseUrl, ...requestOptions } = fetchOptions;

  const fullUrl = new URL(url, baseUrl || getDefaultBaseUrl());
  if (searchParams) {
    searchParams.forEach((value, key) => {
      fullUrl.searchParams.append(key, value);
    });
  }

  const response = await fetch(fullUrl.toString(), requestOptions);

  await runPostResponse({ ...middlewareContext, response });

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText);
  }

  if (response.status === 204 || !response.body) {
    return undefined as Response;
  }

  return (await response.json()) as Response;
};
