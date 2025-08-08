type AbsoluteURLString = `${Lowercase<'http' | 'https'>}://${string}`;

export type BaseURL = AbsoluteURLString | URL;

export const getDefaultBaseUrl = (): string => {
  const baseUrl =
    typeof window === 'undefined' ? process.env.BASE_URL || '' : window.location.origin;

  if (!baseUrl) {
    throw new Error('BASE_URL is not defined');
  }

  return baseUrl;
};

// Helper to preset a base URL on requests.
export { withBaseUrl } from './withBaseUrl.js';
