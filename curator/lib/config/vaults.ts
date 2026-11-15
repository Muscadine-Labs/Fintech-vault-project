// Simplified vault config - only stores addresses
// All other data (name, symbol, asset, performance fee, etc.) is fetched from GraphQL

import { BASE_CHAIN_ID } from '@/lib/constants';

/** Sidebar and list group. Any label — not limited to Prime, Frontier, or Test. */
export type VaultCategory = string;

/** Underlying asset symbol. Any token the vault uses, such as USDC or WETH. */
export type VaultAssetSymbol = string;

export interface VaultAddressConfig {
  address: string;
  chainId: number;
  /** Morpho API schema version — all configured vaults are V2 */
  morphoVersion: 'v2';
  assetSymbol: VaultAssetSymbol;
  /**
   * The asset's decimals. Needed for an asset other than USDC, USDT, DAI, WETH or a BTC token
   * (those are known): Safe previews format amounts with it before anyone signs.
   */
  assetDecimals?: number;
  /** Shown when Morpho has not returned a name yet. */
  name: string;
  /** Group label. Students set this to whatever they call the vault. */
  type: VaultCategory;
  /**
   * Test vaults: omitted from overview, catalog, monthly statements, and
   * default GET /api/vaults.
   */
  excludeFromBusinessViews?: boolean;
  /** When true, excluded from dashboard active-vault and user counts */
  inactive?: boolean;
  /** When true, hidden from sidebar vault list */
  excludeFromSidebar?: boolean;
}

/** Example Base vaults. Replace these with your own. */
const vaultAddresses: VaultAddressConfig[] = [
  {
    address: '0xbeef0786756810478b88982DE00F3CD7fdB8e7c7',
    chainId: BASE_CHAIN_ID,
    morphoVersion: 'v2',
    assetSymbol: 'USDC',
    name: 'Grove x Steakhouse USDC',
    type: 'Steakhouse',
  },
  {
    address: '0x050cE30b927Da55177A4914EC73480238BAD56f0',
    chainId: BASE_CHAIN_ID,
    morphoVersion: 'v2',
    assetSymbol: 'USDC',
    name: 'Gauntlet USDC Prime',
    type: 'Gauntlet',
  },
  {
    address: '0x1deEfABEe758AAbdC29a542B24ca3b75aFD56765',
    chainId: BASE_CHAIN_ID,
    morphoVersion: 'v2',
    assetSymbol: 'USDC',
    name: 'Gauntlet USDC Frontier',
    type: 'Gauntlet',
  },
];

const vaultByAddress = new Map(
  vaultAddresses.map((vault) => [vault.address.toLowerCase(), vault])
);

export const getVaultByAddress = (address: string): VaultAddressConfig | undefined => {
  return vaultByAddress.get(address.toLowerCase());
};

export function getVaultAssetSymbol(address: string): VaultAssetSymbol | undefined {
  return getVaultByAddress(address)?.assetSymbol;
}

/** Fallback label when GraphQL / on-chain name is unavailable. */
export function getConfiguredVaultDisplayName(
  vault: Pick<VaultAddressConfig, 'name'>
): string {
  return vault.name;
}

/** Morpho or on-chain name, or a fallback when that name is missing. */
export function vaultDisplayName(
  name: string | null | undefined,
  fallback = 'Unknown Vault'
): string {
  return name?.trim() || fallback;
}

/** Vault page for a configured address. */
export function getVaultPageHref(address: string, segment?: string): string {
  if (!segment) return `/vault/${address}`;
  return `/vault/${address}/${segment}`;
}

/** Vaults included in the catalog, monthly statements, and GET /api/vaults */
export const getVaultAddressesForBusinessViews = (): VaultAddressConfig[] => {
  return vaultAddresses.filter((v) => !v.excludeFromBusinessViews);
};

/** Business vaults counted in protocol TVL. */
export const getVaultAddressesForProtocolStats = (): VaultAddressConfig[] => {
  return getVaultAddressesForBusinessViews();
};

/**
 * Active business vaults for dashboard unique-user counts and the active-vault
 * KPI. Excludes test (`excludeFromBusinessViews`) and `inactive` vaults.
 */
export const getActiveVaultAddressesForStats = (): VaultAddressConfig[] => {
  return getVaultAddressesForBusinessViews().filter((v) => !v.inactive);
};

/** Vaults shown in the sidebar */
export const getSidebarVaultAddresses = (): VaultAddressConfig[] => {
  return vaultAddresses.filter((v) => !v.inactive && !v.excludeFromSidebar);
};

export type SidebarNavVault = {
  address: string;
  chainId: number;
  name: string;
};

/**
 * Sidebar rows before Morpho names load. The sidebar replaces `name` with the
 * vault list from `/api/vaults` (same source as `/vaults`) once that returns.
 */
export function getSidebarNavVaults(): SidebarNavVault[] {
  return getSidebarVaultAddresses().map((v) => ({
    address: v.address,
    chainId: v.chainId,
    name: getConfiguredVaultDisplayName(v),
  }));
}

/** All vault addresses including hidden vaults (e.g. test). */
export const getAllVaultAddresses = (): VaultAddressConfig[] => {
  return vaultAddresses;
};

/** Type label from config. Unlisted addresses fall back to "Vault". */
export const getVaultCategory = (
  vaultName: string | null | undefined,
  vaultAddress?: string | null
): VaultCategory => {
  void vaultName;
  if (vaultAddress) {
    const cfg = getVaultByAddress(vaultAddress);
    if (cfg?.type) return cfg.type;
  }
  return 'Vault';
};

export type VaultListCategoryGroup<T> = {
  category: VaultCategory;
  label: string;
  vaults: T[];
};

type GroupableVault = {
  name?: string | null;
  address: string;
};

/** List groups by each configured type. */
export function groupVaultsByCategory<T extends GroupableVault>(
  vaults: readonly T[]
): VaultListCategoryGroup<T>[] {
  const categories: VaultListCategoryGroup<T>[] = [];
  const typeOrder: string[] = [];
  for (const vault of vaults) {
    const category = getVaultCategory(vault.name, vault.address);
    if (!typeOrder.includes(category)) typeOrder.push(category);
  }
  for (const category of typeOrder) {
    const matched = vaults.filter(
      (v) => getVaultCategory(v.name, v.address) === category
    );
    if (matched.length === 0) continue;
    categories.push({
      category,
      label: category,
      vaults: matched,
    });
  }
  return categories;
}
