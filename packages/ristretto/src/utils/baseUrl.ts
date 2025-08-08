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

// TODO: We neeed a withBaseUrl helper
