import { afterEach, describe, expect, it, vi } from 'vitest';

import { HttpMethod } from './httpMethod.js';
import { request, RequestOptionsWithoutUrl } from './request.js';
import { withBaseUrl } from './withBaseUrl.js';

describe('withBaseUrl', () => {
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

  const baseRequest = (options?: RequestOptionsWithoutUrl) =>
    request<{ message: string }>(HttpMethod.GET, { ...options, url: '/data' });

  it('should apply default base URL when none provided in options', async () => {
    const req = withBaseUrl('https://api.example.com')(baseRequest);
    const mockResponseData = { message: 'Success' };
    mockFetch.mockResolvedValueOnce(mockedResponseFactory(mockResponseData));

    const result = await req();

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
      headers: undefined,
      method: HttpMethod.GET,
    });
    expect(result).toEqual(mockResponseData);
  });

  it('should allow overriding base URL in options', async () => {
    const req = withBaseUrl('https://api.example.com')(baseRequest);
    const mockResponseData = { message: 'Override' };
    mockFetch.mockResolvedValueOnce(mockedResponseFactory(mockResponseData));

    const result = await req({ baseUrl: 'https://override.example.com' });

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith('https://override.example.com/data', {
      headers: undefined,
      method: HttpMethod.GET,
    });
    expect(result).toEqual(mockResponseData);
  });
});
