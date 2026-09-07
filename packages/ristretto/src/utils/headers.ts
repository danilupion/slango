/**
 * Normalises a `HeadersInit` (plain record, `Headers` instance or entries
 * array) to a plain record so it can be safely spread and extended.
 */
export const toHeaderRecord = (headers: HeadersInit | undefined): Record<string, string> => {
  if (headers === undefined) return {};
  return Array.isArray(headers) || headers instanceof Headers
    ? Object.fromEntries(headers)
    : headers;
};
