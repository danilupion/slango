import { afterEach, describe, expect, it, vi } from 'vitest';

import { patch, post, put } from '../index.js';
import { JsonObjectWithFile, withFormDataBody, withJsonBody } from './body.js';
import { HttpMethod } from './httpMethod.js';
import { request } from './request.js';

vi.mock('./request.js', () => ({
  request: vi.fn(),
}));

const requestMock = vi.mocked(request);

const postRequest = post('/api/data/post');
const putRequest = put('/api/data/put');
const patchRequest = patch('/api/data/patch');

afterEach(() => {
  vi.clearAllMocks();
});

const formDataToObject = (formData: FormData) => {
  const obj: JsonObjectWithFile = {};
  for (const [key, value] of formData.entries()) {
    if (obj[key]) {
      obj[key] = Array.isArray(obj[key]) ? [...obj[key], value] : [obj[key], value];
    } else {
      obj[key] = value;
    }
  }
  return obj;
};

describe('withJsonBody', () => {
  it('should set JSON body and content-type header', async () => {
    const jsonBody = { key: 'value' };
    await withJsonBody(jsonBody)(postRequest)();
    const requestBody = requestMock.mock.calls[0][1].body as string;

    expect(requestBody).toBe(JSON.stringify(jsonBody));
  });

  it('should merge existing headers', async () => {
    const jsonBody = { key: 'value' };
    await withJsonBody(jsonBody)(putRequest)({ headers: { Authorization: 'Bearer token' } });

    expect(requestMock).toHaveBeenCalledWith(HttpMethod.PUT, {
      body: JSON.stringify(jsonBody),
      headers: {
        Authorization: 'Bearer token',
        'content-type': 'application/json',
      },
      url: '/api/data/put',
    });
  });
});

describe('withFormDataBody', () => {
  it('should set FormData body with simple key-value pairs', async () => {
    const body = { key: 'value' };
    await withFormDataBody(body)(patchRequest)();
    const requestBody = requestMock.mock.calls[0][1].body as FormData;

    const formData = new FormData();
    formData.append('key', 'value');

    expect(formDataToObject(requestBody)).toEqual(formDataToObject(formData));
  });

  it('should handle nested objects in FormData', async () => {
    const body = { user: { age: 25, name: 'Alice' } };
    await withFormDataBody(body)(postRequest)();
    const requestBody = requestMock.mock.calls[0][1].body as FormData;

    const formData = new FormData();
    formData.append('user[name]', 'Alice');
    formData.append('user[age]', '25');

    expect(formDataToObject(requestBody)).toEqual(formDataToObject(formData));
  });

  it('should handle arrays in FormData', async () => {
    const body = { tags: ['tag1', 'tag2'] };
    await withFormDataBody(body)(putRequest)();
    const requestBody = requestMock.mock.calls[0][1].body as FormData;

    const formData = new FormData();
    formData.append('tags[0]', 'tag1');
    formData.append('tags[1]', 'tag2');

    expect(formDataToObject(requestBody)).toEqual(formDataToObject(formData));
  });

  it('should handle File and Blob objects in FormData', async () => {
    const file = new File(['file contents'], 'test.txt');
    const body = { file };
    await withFormDataBody(body)(patchRequest)();
    const requestBody = requestMock.mock.calls[0][1].body as FormData;

    const formData = new FormData();
    formData.append('file', file);

    expect(formDataToObject(requestBody)).toEqual(formDataToObject(formData));
  });

  it('should merge existing headers', async () => {
    const jsonBody = { key: 'value' };
    await withFormDataBody(jsonBody)(putRequest)({ headers: { Authorization: 'Bearer token' } });
    const requestBody = requestMock.mock.calls[0][1].body as FormData;

    const formData = new FormData();
    formData.append('key', 'value');

    expect(requestMock).toHaveBeenCalledWith(HttpMethod.PUT, {
      body: expect.any(FormData) as FormData,
      headers: {
        Authorization: 'Bearer token',
      },
      url: '/api/data/put',
    });
    expect(formDataToObject(requestBody)).toEqual(formDataToObject(formData));
  });
});
