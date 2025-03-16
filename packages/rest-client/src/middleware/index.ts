import { Promisable } from 'type-fest';

import { RequestOptions } from '../utils/request.js';

export type PreRequestMiddlewareContext = {
  request: RequestOptions;
};

export type PostResponseMiddlewareContext = PreRequestMiddlewareContext & {
  response: Response;
};

export type MiddlewareNext = (error?: Error) => Promisable<void>;

export type Middleware<Context> = (ctx: Context, next: MiddlewareNext) => Promisable<void>;

export {
  addPostResponseMiddleware as usePostResponse,
  addPreRequestMiddleware as usePreRequest,
} from './runner.js';
