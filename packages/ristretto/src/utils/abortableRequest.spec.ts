import { afterEach, describe, expect, it, vi } from 'vitest';

import { abortableRequest } from './abortableRequest.js';
import { HttpMethod } from './httpMethod.js';
import { request, RequestOptions } from './request.js';

vi.mock('./request', () => ({
  request: vi.fn(),
}));

const requestMock = vi.mocked(request);

afterEach(() => {
  vi.clearAllMocks();
});

describe('abortableRequest', () => {
  it('should create a request with the given method and options', async () => {
    const method = HttpMethod.GET;
    const options: RequestOptions = {
      headers: { 'Content-Type': 'application/json' },
      url: '/api/test',
    };
    const mockResponse = Promise.resolve('response');
    requestMock.mockReturnValue(mockResponse);

    const result = abortableRequest(method, options);

    expect(request).toHaveBeenCalledWith(method, {
      ...options,
      signal: expect.any(AbortSignal) as AbortSignal,
    });
    await expect(result).resolves.toBe('response');
  });

  it('should abort the request when abort is called', async () => {
    const method = HttpMethod.POST;
    const options: RequestOptions = { url: '/api/test' };

    const mockedResponse = new Promise((_, reject) => {
      setTimeout(() => reject(new DOMException('Aborted', 'AbortError')));
    });
    requestMock.mockReturnValueOnce(mockedResponse);

    const abortable = abortableRequest(method, options);
    abortable.abort();

    await expect(abortable).rejects.toThrowError('Aborted');
  });
});
