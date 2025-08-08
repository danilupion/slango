import { AbortablePromise } from './abortableRequest.js';
import { Request, RequestOptionsWithoutUrl } from './request.js';

export const withBearerToken =
  (bearerToken: string) =>
  <Response, PromiseType extends AbortablePromise<Response> | Promise<Response>>(
    req: Request<Response, PromiseType>,
  ) =>
  (options: Omit<RequestOptionsWithoutUrl, 'body'> = {}) =>
    req({
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${bearerToken}`,
      },
    });
