function normalizeOrigin(url: string): string {
  return url.replace(/\/$/, '');
}

/** Vercel sets this on every deployment (server side): the project's production domain, no scheme. */
function vercelProductionOrigin(): string | null {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  return host ? `https://${host.replace(/\/$/, '')}` : null;
}

/** Public origin for WalletConnect / Reown AppKit metadata. */
export function getAppUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return normalizeOrigin(fromEnv);

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return vercelProductionOrigin() ?? 'http://localhost:3001';
}
