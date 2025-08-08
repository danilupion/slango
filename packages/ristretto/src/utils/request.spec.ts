import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  MiddlewareNext,
  PostResponseMiddlewareContext,
  PreRequestMiddlewareContext,
  usePostResponse,
  usePreRequest,
} from '../middleware/index.js';
import { HttpError } from './HttpError.js';
import { HttpMethod } from './httpMethod.js';
import { request, RequestOptions } from './request.js';

describe('request', () => {
  const mockFetch = vi.fn();
  globalThis.fetch = mockFetch;

  afterEach(() => {
    mockFetch.mockClear();
  });

  const mockedResponseFactory = <T extends Record<string, unknown>>(data: T) => ({
    body: JSON.stringify(data),
    json: () => Promise.resolve(data),
    ok: true,
  });

  it('should make a successful GET request and return JSON response', async () => {
    const mockResponseData = { message: 'Success' };
    mockFetch.mockResolvedValueOnce(mockedResponseFactory(mockResponseData));

    const options: RequestOptions = {
      method: HttpMethod.GET,
      url: '/api/data',
    };

    const result = await request<typeof mockResponseData>(HttpMethod.GET, options);

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(`${window.location.origin}/api/data`, {
      headers: undefined,
      method: HttpMethod.GET,
    });
    expect(result).toEqual(mockResponseData);
  });

  it('should append query parameters to the URL', async () => {
    const mockResponseData = { message: 'Success with query params' };
    mockFetch.mockResolvedValueOnce(mockedResponseFactory(mockResponseData));

    const options: RequestOptions = {
      method: HttpMethod.GET,
      searchParams: new URLSearchParams({ page: '1', search: 'test' }),
      url: '/api/data',
    };

    const result = await request<typeof mockResponseData>(HttpMethod.GET, options);

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
      `${window.location.origin}/api/data?page=1&search=test`,
      {
        headers: undefined,
        method: HttpMethod.GET,
      },
    );
    expect(result).toEqual(mockResponseData);
  });

  it('should throw an error if response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const options: RequestOptions = {
      method: HttpMethod.GET,
      url: '/api/notfound',
    };

    await expect(request(HttpMethod.GET, options)).rejects.toThrow(new HttpError(404, 'Not Found'));
    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(`${window.location.origin}/api/notfound`, {
      headers: undefined,
      method: HttpMethod.GET,
    });
  });

  it('should include custom headers in the request', async () => {
    const mockResponseData = { message: 'Success with headers' };
    mockFetch.mockResolvedValueOnce(mockedResponseFactory(mockResponseData));

    const options: RequestOptions = {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      method: HttpMethod.GET,
      url: '/api/headers',
    };

    const result = await request<typeof mockResponseData>(HttpMethod.GET, options);

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(`${window.location.origin}/api/headers`, {
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      method: HttpMethod.GET,
    });
    expect(result).toEqual(mockResponseData);
  });

  it('should send JSON body in POST request', async () => {
    const mockResponseData = { message: 'Success with JSON body' };
    mockFetch.mockResolvedValueOnce(mockedResponseFactory(mockResponseData));

    const options: RequestOptions = {
      body: JSON.stringify({ key: 'value' }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: HttpMethod.POST,
      url: '/api/post',
    };

    const result = await request<typeof mockResponseData>(HttpMethod.POST, options);

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(`${window.location.origin}/api/post`, {
      body: JSON.stringify({ key: 'value' }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: HttpMethod.POST,
    });
    expect(result).toEqual(mockResponseData);
  });

  it('should call middleware before and after the request', async () => {
    const mockResponseData = { message: 'Middleware test' };
    mockFetch.mockResolvedValueOnce({
      ...mockedResponseFactory({ ...mockResponseData }),
      status: 200,
    });

    const options: RequestOptions = {
      method: HttpMethod.GET,
      url: '/api/middleware',
      headers: {
        'X-Test-Header': 'TestValue',
      },
    };

    const preRequestMiddleware = vi.fn(
      async (ctx: PreRequestMiddlewareContext, next: MiddlewareNext) => {
        expect(ctx.request.method).toBe(HttpMethod.GET);
        expect((ctx.request.headers! as Record<string, string>)['X-Test-Header']).toBe('TestValue');
        await next();
      },
    );
    const postResponseMiddleware = vi.fn(
      async (ctx: PostResponseMiddlewareContext, next: MiddlewareNext) => {
        expect(ctx.response.ok).toBe(true);
        expect(ctx.response.status).toBe(200);
        expect(ctx.response.body).toBe(JSON.stringify(mockResponseData));
        await next();
      },
    );
    usePreRequest(preRequestMiddleware);
    usePostResponse(postResponseMiddleware);

    await request<typeof mockResponseData>(HttpMethod.GET, options);

    expect(preRequestMiddleware).toHaveBeenCalledOnce();
    expect(postResponseMiddleware).toHaveBeenCalledOnce();
  });
});
