import { HttpError } from './HttpError.js';
import { RequestOptionsWithoutUrl } from './request.js';

export const withNotFoundAsNull =
  <Response>(requestFn: (options?: RequestOptionsWithoutUrl) => Promise<Response>) =>
  async (options?: RequestOptionsWithoutUrl): Promise<null | Response> => {
    try {
      return await requestFn(options);
    } catch (error) {
      if (error instanceof HttpError && error.status == 404) {
        return null;
      }
      throw error;
    }
  };
