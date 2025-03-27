import { JsonPrimitive as BaseJsonPrimitive, JsonObject, JsonValue } from 'type-fest';

import { AbortablePromise } from './abortableRequest.js';
import { Request, RequestOptionsWithoutUrl } from './request.js';

// undefined is not allowed in JsonObjectWithFile (because it is not allowed in Json)
export type JsonObjectWithFile = {
  [Key in string]: JsonValueWithFile;
} & {
  [Key in string]?: JsonValueWithFile;
};
type JsonArrayWithFile = JsonValueWithFile[] | readonly JsonValueWithFile[];
type JsonPrimitiveWithFile = BaseJsonPrimitive | Blob | File;
type JsonValueWithFile = JsonArrayWithFile | JsonObjectWithFile | JsonPrimitiveWithFile;

const isJsonObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && !Array.isArray(value);

const jsonToFormData = (
  json: JsonObjectWithFile,
  formData = new FormData(),
  parentKey = '',
): FormData => {
  const appendValue = (key: string, value: unknown) => {
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (isJsonObject(value)) {
      // Recursive call for nested objects
      jsonToFormData(value, formData, key);
    } else {
      formData.append(key, value as Blob | string);
    }
  };

  Object.entries(json).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}[${key}]` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => appendValue(`${fullKey}[${index}]`, item));
    } else {
      appendValue(fullKey, value);
    }
  });

  return formData;
};

export type Body = BodyInit | JsonValueWithFile;

export const withJsonBody =
  <Body extends JsonValue>(fixedBody: Body) =>
  <Response, PromiseType extends AbortablePromise<Response> | Promise<Response>>(
    req: Request<Response, PromiseType>,
  ) =>
  (options: Omit<RequestOptionsWithoutUrl, 'body'> = {}) =>
    req({
      ...options,
      body: JSON.stringify(fixedBody),
      headers: {
        ...options.headers,
        'content-type': 'application/json',
      },
    });

export const withFormDataBody =
  <Body extends JsonObjectWithFile>(fixedBody: Body) =>
  <Response, PromiseType extends AbortablePromise<Response> | Promise<Response>>(
    req: Request<Response, PromiseType>,
  ) =>
  (options: Omit<RequestOptionsWithoutUrl, 'body'> = {}) =>
    req({
      ...options,
      body: jsonToFormData(fixedBody),
    });
