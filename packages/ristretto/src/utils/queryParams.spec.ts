import { afterEach, describe, expect, it, vi } from 'vitest';

import { get, patch, post, put } from '../index.js';
import { HttpMethod } from './httpMethod.js';
import { QueryParams, withQueryParams } from './queryParams.js';
import { request } from './request.js';

vi.mock('./request.js', () => ({
  request: vi.fn(),
}));

const requestMock = vi.mocked(request);

const getRequest = get('/api/data/get');
const postRequest = post('/api/data/post');
const putRequest = put('/api/data/put');
const patchRequest = patch('/api/data/patch');

const compareSearchParams = (reference: URLSearchParams, value: URLSearchParams) => {
  const referenceArray = Array.from(reference.entries());
  const valueArray = Array.from(value.entries());
  expect(referenceArray.length).toEqual(valueArray.length);
  expect(valueArray).toEqual(expect.arrayContaining(referenceArray));
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('withQueryParams', () => {
  it('should add single query parameters to the request URL', async () => {
    const query: QueryParams = { baz: 42, foo: 'bar' };
    await withQueryParams(query)(getRequest)();
    const requestSearchParams = requestMock.mock.calls[0][1].searchParams!;

    compareSearchParams(requestSearchParams, new URLSearchParams('foo=bar&baz=42'));
  });

  it('should handle array values in query parameters', async () => {
    const query: QueryParams = { foo: ['bar', 'baz'] };
    await withQueryParams(query)(postRequest)();
    const requestSearchParams = requestMock.mock.calls[0][1].searchParams!;

    compareSearchParams(requestSearchParams, new URLSearchParams('foo=bar&foo=baz'));
  });

  it('should ignore null and undefined values in query parameters', async () => {
    const query: QueryParams = { baz: null, foo: 'bar', qux: undefined };
    await withQueryParams(query)(putRequest)();
    const requestSearchParams = requestMock.mock.calls[0][1].searchParams!;

    compareSearchParams(requestSearchParams, new URLSearchParams('foo=bar'));
  });

  it('should handle boolean values in query parameters', async () => {
    const query: QueryParams = { bar: false, foo: true };
    await withQueryParams(query)(patchRequest)();
    const requestSearchParams = requestMock.mock.calls[0][1].searchParams!;

    compareSearchParams(requestSearchParams, new URLSearchParams('foo=true&bar=false'));
  });

  it('should merge query parameters with existing options', async () => {
    const query: QueryParams = { foo: 'bar' };
    await withQueryParams(query)(getRequest)({ headers: { Authorization: 'Bearer token' } });
    const requestSearchParams = requestMock.mock.calls[0][1].searchParams!;

    compareSearchParams(requestSearchParams, new URLSearchParams('foo=bar'));
    expect(requestMock).toHaveBeenCalledWith(HttpMethod.GET, {
      headers: { Authorization: 'Bearer token' },
      searchParams: expect.any(URLSearchParams) as URLSearchParams,
      url: '/api/data/get',
    });
  });
});
