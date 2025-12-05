// tests/ui/utils/urlHelpers.ts

export function getBaseUrl(url: string): string {
  const { origin } = new URL(url);
  return origin;
}
