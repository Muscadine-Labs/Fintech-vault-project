import { BASE_CHAIN_ID } from '@/lib/constants';

export type VaultVersion = 'v2';

/** Any label you choose. The vault list filter uses these values. */
export type VaultStrategy = string;

export interface VaultDefinition {
  address: string;
  name: string;
  /** Underlying asset symbol (USDC, cbBTC, WETH). */
  symbol: string;
  /** Share token label (e.g. mpUSDC). */
  vaultSymbol: string;
  chainId: number;
  version: VaultVersion;
  /** Group label. Not limited to Prime or Frontier. */
  type: VaultStrategy;
}

const BASE = BASE_CHAIN_ID;

/** Example Base vaults. Replace these with your own. */
const GROVE_STEAKHOUSE_USDC = '0xbeef0786756810478b88982DE00F3CD7fdB8e7c7';
const GAUNTLET_USDC_PRIME = '0x050cE30b927Da55177A4914EC73480238BAD56f0';
const GAUNTLET_USDC_FRONTIER = '0x1deEfABEe758AAbdC29a542B24ca3b75aFD56765';

export const VAULTS: Record<string, VaultDefinition> = {
  GROVE_STEAKHOUSE_USDC_V2: {
    address: GROVE_STEAKHOUSE_USDC,
    name: 'Grove x Steakhouse USDC',
    symbol: 'USDC',
    vaultSymbol: 'grove-steakUSDC',
    chainId: BASE,
    version: 'v2',
    type: 'Steakhouse',
  },
  GAUNTLET_USDC_PRIME_V2: {
    address: GAUNTLET_USDC_PRIME,
    name: 'Gauntlet USDC Prime',
    symbol: 'USDC',
    vaultSymbol: 'gtusdcp',
    chainId: BASE,
    version: 'v2',
    type: 'Gauntlet',
  },
  GAUNTLET_USDC_FRONTIER_V2: {
    address: GAUNTLET_USDC_FRONTIER,
    name: 'Gauntlet USDC Frontier',
    symbol: 'USDC',
    vaultSymbol: 'gtusdcf',
    chainId: BASE,
    version: 'v2',
    type: 'Gauntlet',
  },
};

export function getRegistryVaultList(): VaultDefinition[] {
  return Object.values(VAULTS);
}
