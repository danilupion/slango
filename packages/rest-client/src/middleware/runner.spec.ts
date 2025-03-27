import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  MiddlewareNext,
  PostResponseMiddlewareContext,
  PreRequestMiddlewareContext,
} from './index.js';
import {
  addPostResponseMiddleware,
  addPreRequestMiddleware,
  clearPostResponseMiddlewares,
  clearPreRequestMiddlewares,
  removePostResponseMiddleware,
  removePreRequestMiddleware,
  runPostResponse,
  runPreRequest,
} from './runner.js';

const createPreRequestContext = (): PreRequestMiddlewareContext => ({
  request: { url: 'https://example.com', method: 'GET', headers: {} },
});

const createPostResponseContext = (): PostResponseMiddlewareContext => ({
  request: { url: 'https://example.com', method: 'GET', headers: {} },
  response: new Response(null, { status: 200 }),
});

describe('runner.ts', () => {
  beforeEach(() => {
    clearPostResponseMiddlewares();
    clearPreRequestMiddlewares();
  });

  it('should add and remove pre-request middleware', async () => {
    const middleware1 = vi.fn((ctx, next: MiddlewareNext) => next());
    const middleware2 = vi.fn();

    addPreRequestMiddleware(middleware1);
    addPreRequestMiddleware(middleware2);
    await runPreRequest(createPreRequestContext());
    expect(middleware1).toHaveBeenCalledTimes(1);
    expect(middleware2).toHaveBeenCalledTimes(1);

    removePreRequestMiddleware(middleware2);
    await runPreRequest(createPreRequestContext());
    expect(middleware1).toHaveBeenCalledTimes(2);
    expect(middleware2).toHaveBeenCalledTimes(1);
  });

  it('should add and remove post-request middleware', async () => {
    const middleware1 = vi.fn((ctx, next: MiddlewareNext) => next());
    const middleware2 = vi.fn();

    addPostResponseMiddleware(middleware1);
    addPostResponseMiddleware(middleware2);
    await runPostResponse(createPostResponseContext());
    expect(middleware1).toHaveBeenCalledTimes(1);
    expect(middleware2).toHaveBeenCalledTimes(1);

    removePostResponseMiddleware(middleware2);
    await runPostResponse(createPostResponseContext());
    expect(middleware1).toHaveBeenCalledTimes(2);
    expect(middleware2).toHaveBeenCalledTimes(1);
  });

  it('should run pre-request middlewares in order and modify context', async () => {
    const middleware1 = vi.fn(async (ctx: PreRequestMiddlewareContext, next: MiddlewareNext) => {
      (ctx.request.headers! as Record<string, string>)['X-Test'] = 'Middleware1';
      (ctx.request.headers! as Record<string, string>)['X-Override'] = 'Middleware1';
      await next();
    });
    const middleware2 = vi.fn(async (ctx: PreRequestMiddlewareContext, next: MiddlewareNext) => {
      (ctx.request.headers! as Record<string, string>)['X-Chain'] = 'Middleware2';
      (ctx.request.headers! as Record<string, string>)['X-Override'] = 'Middleware2';
      await next();
    });

    addPreRequestMiddleware(middleware1);
    addPreRequestMiddleware(middleware2);

    const context = createPreRequestContext();
    await runPreRequest(context);

    expect(middleware1).toHaveBeenCalledOnce();
    expect(middleware2).toHaveBeenCalledOnce();
    expect(context.request.headers).toEqual({
      'X-Test': 'Middleware1',
      'X-Chain': 'Middleware2',
      'X-Override': 'Middleware2',
    });
  });

  it('should run post-response middlewares in order and modify context', async () => {
    const middleware1 = vi.fn(async (ctx: PostResponseMiddlewareContext, next: MiddlewareNext) => {
      ctx.response.headers.set('X-Test', 'Middleware1');
      ctx.response.headers.set('X-Override', 'Middleware1');
      await next();
    });
    const middleware2 = vi.fn(async (ctx: PostResponseMiddlewareContext, next: MiddlewareNext) => {
      ctx.response.headers.set('X-Chain', 'Middleware2');
      ctx.response.headers.set('X-Override', 'Middleware2');

      await next();
    });

    addPostResponseMiddleware(middleware1);
    addPostResponseMiddleware(middleware2);

    const context = createPostResponseContext();
    await runPostResponse(context);

    expect(middleware1).toHaveBeenCalledOnce();
    expect(middleware2).toHaveBeenCalledOnce();
    expect(context.response.headers.get('X-Test')).toBe('Middleware1');
    expect(context.response.headers.get('X-Chain')).toBe('Middleware2');
    expect(context.response.headers.get('X-Override')).toBe('Middleware2');
  });

  it('should handle errors in pre-request middlewares and stop pipeline', async () => {
    const middleware1 = vi.fn(async (ctx: PreRequestMiddlewareContext, next: MiddlewareNext) => {
      await next();
    });
    const errorMiddleware = vi.fn(() => {
      throw new Error('Test error');
    });
    const middleware2 = vi.fn(async (ctx: PreRequestMiddlewareContext, next: MiddlewareNext) => {
      await next();
    });

    addPreRequestMiddleware(middleware1);
    addPreRequestMiddleware(errorMiddleware);
    addPreRequestMiddleware(middleware2);

    const context = createPreRequestContext();

    await expect(runPreRequest(context)).rejects.toThrow('Test error');

    expect(middleware1).toHaveBeenCalledOnce();
    expect(errorMiddleware).toHaveBeenCalledOnce();
    expect(middleware2).not.toHaveBeenCalled();

    removePreRequestMiddleware(middleware1);
    removePreRequestMiddleware(errorMiddleware);
    removePreRequestMiddleware(middleware2);
  });

  it('should handle errors in post-response middlewares and stop pipeline', async () => {
    const middleware1 = vi.fn(async (ctx: PostResponseMiddlewareContext, next: MiddlewareNext) => {
      await next();
    });
    const errorMiddleware = vi.fn(() => {
      throw new Error('Test error');
    });
    const middleware2 = vi.fn(async (ctx: PostResponseMiddlewareContext, next: MiddlewareNext) => {
      await next();
    });

    addPostResponseMiddleware(middleware1);
    addPostResponseMiddleware(errorMiddleware);
    addPostResponseMiddleware(middleware2);

    const context = createPostResponseContext();

    await expect(runPostResponse(context)).rejects.toThrow('Test error');

    expect(middleware1).toHaveBeenCalledOnce();
    expect(errorMiddleware).toHaveBeenCalledOnce();
    expect(middleware2).not.toHaveBeenCalled();

    removePostResponseMiddleware(middleware1);
    removePostResponseMiddleware(errorMiddleware);
    removePostResponseMiddleware(middleware2);
  });
});
