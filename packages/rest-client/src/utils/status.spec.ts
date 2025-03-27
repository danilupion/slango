import { afterEach, describe, expect, it, vi } from 'vitest';

import { get } from '../index.js';
import { HttpError } from './HttpError.js';
import { HttpMethod } from './httpMethod.js';
import { request, RequestOptionsWithoutUrl } from './request.js';
import { withNotFoundAsNull } from './status.js';

vi.mock('./request.js', () => ({
  request: vi.fn(),
}));

const requestMock = vi.mocked(request);

const getRequest = get('/api/data/get');

afterEach(() => {
  vi.clearAllMocks();
});

describe('withNotFoundAsNull', () => {
  it('should return the response when the request succeeds', async () => {
    const mockResponse = { data: 'valid response' };
    requestMock.mockResolvedValueOnce(mockResponse);

    const fetchData = withNotFoundAsNull(getRequest);
    const result = await fetchData();

    expect(result).toEqual(mockResponse);
    expect(requestMock).toHaveBeenCalledWith(HttpMethod.GET, { url: '/api/data/get' });
  });

  it('should return null when the request fails with 404', async () => {
    requestMock.mockRejectedValueOnce(new HttpError(404, 'Not Found'));

    const fetchData = withNotFoundAsNull(getRequest);
    const result = await fetchData();

    expect(result).toBeNull();
    expect(requestMock).toHaveBeenCalledWith(HttpMethod.GET, { url: '/api/data/get' });
  });

  it('should throw an error when the request fails with an error other than 404', async () => {
    requestMock.mockRejectedValueOnce(new HttpError(500, 'Internal Server Error'));

    const fetchData = withNotFoundAsNull(getRequest);

    await expect(fetchData()).rejects.toThrow(new HttpError(500, 'Internal Server Error'));
    expect(requestMock).toHaveBeenCalledWith(HttpMethod.GET, { url: '/api/data/get' });
  });

  it('should forward request options when calling the request function', async () => {
    const mockResponse = { data: 'valid response' };
    requestMock.mockResolvedValueOnce(mockResponse);

    const fetchData = withNotFoundAsNull(getRequest);
    const options: RequestOptionsWithoutUrl = { headers: { Authorization: 'Bearer token' } };
    const result = await fetchData(options);

    expect(result).toEqual(mockResponse);
    expect(requestMock).toHaveBeenCalledWith(HttpMethod.GET, {
      url: '/api/data/get',
      headers: { Authorization: 'Bearer token' },
    });
  });
});
