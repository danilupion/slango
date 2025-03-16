import { HttpMethod } from './httpMethod.js';
import { request, RequestOptions } from './request.js';

export interface AbortablePromise<Response> extends Promise<Response> {
  abort: () => void;
}

export const abortableRequest = <Response>(
  method: HttpMethod,
  options: RequestOptions,
): AbortablePromise<Response> => {
  const controller = new AbortController();
  const signal = controller.signal;

  const r = request(method, {
    signal,
    ...options,
  }) as AbortablePromise<Response>;
  r.abort = () => controller.abort();

  return r;
};
