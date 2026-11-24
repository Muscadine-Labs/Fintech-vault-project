/**
 * Network, API, and timing constants used across the app.
 */

export const BASE_CHAIN_ID = 8453;
/**
 * Networks the app can browse. Base only — the account sheet, wallet, and
 * market APIs do not offer another chain.
 */
export const CURATOR_MARKET_NETWORKS = [
  { chainId: BASE_CHAIN_ID, name: 'Base', morphoSlug: 'base' },
] as const;

/** Sidebar vault grouping — same chain set as markets/wallet. */
export const SIDEBAR_NETWORKS = CURATOR_MARKET_NETWORKS.map(({ chainId, name }) => ({
  chainId,
  name,
}));

const BASE_SCAN_URL = 'https://basescan.org';

export function getScanUrlForChain(chainId: number): string {
  void chainId;
  return BASE_SCAN_URL;
}

export function getScanNameForChain(chainId: number): string {
  void chainId;
  return 'Basescan';
}

export function getAddressScanUrl(chainId: number, address: string): string {
  return `${getScanUrlForChain(chainId)}/address/${address}`;
}

/** Parse `?chainId=` for curator market pages; invalid values fall back to Base. */
export function parseCuratorMarketChainId(raw: string | null | undefined): number {
  const parsed = raw != null ? Number(raw) : BASE_CHAIN_ID;
  if (CURATOR_MARKET_NETWORKS.some((n) => n.chainId === parsed)) {
    return parsed;
  }
  return BASE_CHAIN_ID;
}

export const BPS_PER_ONE = 10000;

export const GRAPHQL_FIRST_LIMIT = 1000;
export const GRAPHQL_TRANSACTIONS_LIMIT = 10;

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

export const MINUTE_MS = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
const HOUR_MS = MINUTE_MS * MINUTES_PER_HOUR;
const DAY_MS = HOUR_MS * HOURS_PER_DAY;

export const DAYS_30_MS = 30 * DAY_MS;

/** WAD max-rate annualization (per-second rate × year). */
export const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

export const MORPHO_GRAPHQL_ENDPOINT = 'https://api.morpho.org/graphql';
/** Morpho REST (Midnight books/markets — GraphQL is Blue-only). */
export const MORPHO_REST_ORIGIN = 'https://api.morpho.org';
export const MORPHO_APP_ORIGIN = 'https://app.morpho.org';
/** Morpho Markets app (Midnight / fixed-term books). */
export const MORPHO_MARKETS_ORIGIN = 'https://markets.morpho.org';
/** Fixed rate (Midnight order book) market list. */
export const MORPHO_FIXED_RATE_MARKETS_URL = `${MORPHO_MARKETS_ORIGIN}/fixed`;
/** Variable rate (Blue IRM) market list. */
export const MORPHO_VARIABLE_RATE_MARKETS_URL = `${MORPHO_APP_ORIGIN}/variable`;

/** Base USDC. */
export const BASE_USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;
/** Base cbBTC. */
export const BASE_CBBTC_ADDRESS = '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf' as const;
/** Base WETH (canonical wrapped ETH). */
export const BASE_WETH_ADDRESS = '0x4200000000000000000000000000000000000006' as const;

export const EXTERNAL_API_TIMEOUT_MS = 60000;
export const RATE_LIMIT_REQUESTS_PER_MINUTE = 60;

export const getDaysAgoTimestamp = (days: number): number => {
  return Math.floor((Date.now() - days * DAY_MS) / MILLISECONDS_PER_SECOND);
};
