import {
  Middleware,
  MiddlewareNext,
  PostResponseMiddlewareContext,
  PreRequestMiddlewareContext,
} from './index.js';

export type PostResponseMiddleWare = Middleware<PostResponseMiddlewareContext>;
export type PreRequestMiddleWare = Middleware<PreRequestMiddlewareContext>;

const preRequestMiddlewares: PreRequestMiddleWare[] = [];
const postResponseMiddlewares: PostResponseMiddleWare[] = [];

export const addPreRequestMiddleware = (middleware: PreRequestMiddleWare) => {
  preRequestMiddlewares.push(middleware);
};

export const addPostResponseMiddleware = (middleware: PostResponseMiddleWare) => {
  postResponseMiddlewares.push(middleware);
};

export const removePreRequestMiddleware = (middleware: PreRequestMiddleWare) => {
  const index = preRequestMiddlewares.findIndex((m) => m === middleware);
  if (index !== -1) preRequestMiddlewares.splice(index, 1);
};

export const removePostResponseMiddleware = (middleware: PostResponseMiddleWare) => {
  const index = postResponseMiddlewares.findIndex((m) => m === middleware);
  if (index !== -1) postResponseMiddlewares.splice(index, 1);
};

export const clearPreRequestMiddlewares = () => {
  preRequestMiddlewares.length = 0;
};

export const clearPostResponseMiddlewares = () => {
  postResponseMiddlewares.length = 0;
};

const runMiddlewares = <Context>(middlewares: Middleware<Context>[]) => {
  return async (context: Context): Promise<void> => {
    let index = 0;

    const next: MiddlewareNext = async (error?: Error) => {
      if (error) {
        throw error;
      }

      if (index < middlewares.length) {
        const currentMiddleware = middlewares[index];
        index++;
        try {
          await currentMiddleware(context, next);
        } catch (err) {
          await next(err as Error);
        }
      }
    };

    await next();
  };
};

export const runPreRequest = runMiddlewares(preRequestMiddlewares);
export const runPostResponse = runMiddlewares(postResponseMiddlewares);
