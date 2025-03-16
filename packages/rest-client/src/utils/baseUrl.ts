export const getBaseUrl = (): string => {
  const baseUrl =
    typeof window === 'undefined' ? process.env.BASE_URL || '' : window.location.origin;

  if (!baseUrl) {
    throw new Error('BASE_URL is not defined');
  }

  return baseUrl;
};
