import { AbortablePromise, abortableRequest } from '../utils/abortableRequest.js';
import { HttpMethod } from '../utils/httpMethod.js';
import { Request as BaseRequest, RequestOptionsWithoutUrl, RequestURL } from '../utils/request.js';

export type { AbortablePromise } from '../utils/abortableRequest.js';
export { withBearerToken } from '../utils/auth.js';
export type { BaseURL } from '../utils/baseUrl.js';
export { withBaseUrl } from '../utils/baseUrl.js';

export { withFormDataBody, withJsonBody } from '../utils/body.js';
export { HttpError } from '../utils/HttpError.js';
export { withQueryParams } from '../utils/queryParams.js';
export type { RequestOptionsWithoutUrl, RequestURL } from '../utils/request.js';
export { withNotFoundAsNull } from '../utils/status.js';

export type Request<Response> = BaseRequest<Response, AbortablePromise<Response>>;

const abortableRequestFactory =
  (method: HttpMethod) =>
  <Response>(url: RequestURL) =>
  (options?: RequestOptionsWithoutUrl): AbortablePromise<Response> =>
    abortableRequest<Response>(method, { ...options, url });

export const get = abortableRequestFactory(HttpMethod.GET);

export const del = abortableRequestFactory(HttpMethod.DELETE);

export const post = abortableRequestFactory(HttpMethod.POST);

export const put = abortableRequestFactory(HttpMethod.PUT);

export const patch = abortableRequestFactory(HttpMethod.PATCH);

export const withTransformer =
  <Input, Output>(transformFn: (input: Input) => Output) =>
  (req: Request<Input>): Request<Output> =>
  (options?: RequestOptionsWithoutUrl) => {
    const abortablePromise = req(options);

    const wrappedPromise = abortablePromise.then((result: Input) =>
      transformFn ? transformFn(result) : result,
    ) as AbortablePromise<Output>;

    if ('abort' in abortablePromise) {
      // Assign the abort function if it's an AbortablePromise
      wrappedPromise.abort = abortablePromise.abort;
    }

    return wrappedPromise;
  };
