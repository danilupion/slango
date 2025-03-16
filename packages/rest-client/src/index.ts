import { HttpMethod } from './utils/httpMethod.js';
import { Request as BaseRequest, request, RequestOptionsWithoutUrl } from './utils/request.js';

export { withBearerToken } from './utils/auth.js';
export { withFormDataBody, withJsonBody } from './utils/body.js';
export { HttpError } from './utils/HttpError.js';
export { withQueryParams } from './utils/queryParams.js';
export type { RequestOptionsWithoutUrl } from './utils/request.js';
export { withNotFoundAsNull } from './utils/status.js';

export type Request<Response> = BaseRequest<Response, Promise<Response>>;

const requestFactory =
  (method: HttpMethod) =>
  <Response>(url: string): Request<Response> =>
  (options?: RequestOptionsWithoutUrl): Promise<Response> =>
    request<Response>(method, { ...options, url });

export const get = requestFactory(HttpMethod.GET);

export const del = requestFactory(HttpMethod.DELETE);

export const post = requestFactory(HttpMethod.POST);

export const put = requestFactory(HttpMethod.PUT);

export const patch = requestFactory(HttpMethod.PATCH);
