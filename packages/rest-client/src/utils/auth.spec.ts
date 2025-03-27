import { afterEach, describe, expect, it, vi } from 'vitest';

import { get, post, put } from '../index.js';
import { withBearerToken } from './auth.js';
import { request } from './request.js';

vi.mock('./request.js', () => ({
  request: vi.fn(),
}));

const requestMock = vi.mocked(request);

const getRequest = get('/api/data/get');
const postRequest = post('/api/data/post');
const putRequest = put('/api/data/put');

afterEach(() => {
  vi.clearAllMocks();
});

describe('withBearerToken', () => {
  it('should add the Authorization header with the provided bearer token', async () => {
    const bearerToken = 'test-token';
    await withBearerToken(bearerToken)(getRequest)();
    const requestHeaders = requestMock.mock.calls[0][1].headers!;

    expect(requestHeaders).toEqual({
      Authorization: `Bearer ${bearerToken}`,
    });
  });

  it('should merge the Authorization header with existing headers', async () => {
    const bearerToken = 'test-token';
    await withBearerToken(bearerToken)(postRequest)({
      headers: { 'X-Test': 'Value' },
    });
    const requestHeaders = requestMock.mock.calls[0][1].headers!;

    expect(requestHeaders).toEqual({
      Authorization: `Bearer ${bearerToken}`,
      'X-Test': 'Value',
    });
  });

  it('should override any existing Authorization header with the provided bearer token', async () => {
    const bearerToken = 'new-token';
    await withBearerToken(bearerToken)(putRequest)({
      headers: {
        Authorization: `Bearer Test Test`,
      },
    });
    const requestHeaders = requestMock.mock.calls[0][1].headers!;

    expect(requestHeaders).toEqual({
      Authorization: `Bearer ${bearerToken}`,
    });
  });
});
