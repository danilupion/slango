import type { BaseURL } from './baseUrl.js';

import { AbortablePromise } from './abortableRequest.js';
import { Request, RequestOptionsWithoutUrl } from './request.js';

export const withBaseUrl =
  (baseUrl: BaseURL) =>
  <Response, PromiseType extends AbortablePromise<Response> | Promise<Response>>(
    req: Request<Response, PromiseType>,
  ): Request<Response, PromiseType> =>
  (options: RequestOptionsWithoutUrl = {}) =>
    req({ baseUrl, ...options });
