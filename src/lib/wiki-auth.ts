export const DEFAULT_WIKI_PASSWORD = 'eMoticoSince@2026';
export const DEFAULT_WIKI_AUTH_PASSWORD = 'eMoticoSince@2026';

export function getWikiPassword() {
  if (process.env.WIKI_PASSWORD) return process.env.WIKI_PASSWORD;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('WIKI_PASSWORD must be configured in production');
  }
  return DEFAULT_WIKI_PASSWORD;
}

export function getWikiAuthPassword() {
  if (process.env.WIKI_AUTH_PASSWORD) return process.env.WIKI_AUTH_PASSWORD;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('WIKI_AUTH_PASSWORD must be configured in production');
  }
  return DEFAULT_WIKI_AUTH_PASSWORD;
}
