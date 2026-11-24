import { describe, expect, it } from 'vitest';
import {
  getAllVaultAddresses,
  getConfiguredVaultDisplayName,
  getSidebarNavVaults,
  getVaultPageHref,
  groupVaultsByCategory,
  vaultDisplayName,
} from '@/lib/config/vaults';

const GROVE_USDC = '0xbeef0786756810478b88982DE00F3CD7fdB8e7c7';

describe('vaultDisplayName', () => {
  it('returns the vault name', () => {
    expect(vaultDisplayName('USDC Prime')).toBe('USDC Prime');
    expect(vaultDisplayName(null)).toBe('Unknown Vault');
  });
});

describe('getConfiguredVaultDisplayName', () => {
  it('uses the configured name', () => {
    expect(getConfiguredVaultDisplayName({ name: 'USDC Prime' })).toBe('USDC Prime');
  });
});

describe('groupVaultsByCategory', () => {
  it('groups configured vaults by type', () => {
    const grouped = groupVaultsByCategory(getAllVaultAddresses());
    expect(grouped.map((c) => c.category)).toEqual(['Steakhouse', 'Gauntlet']);
  });
});

describe('getVaultPageHref', () => {
  it('keeps a vault on its own page', () => {
    expect(getVaultPageHref(GROVE_USDC).toLowerCase()).toBe(
      `/vault/${GROVE_USDC}`.toLowerCase()
    );
  });
});

describe('getSidebarNavVaults', () => {
  it('lists configured vaults with their names', () => {
    const nav = getSidebarNavVaults();
    expect(nav.some((v) => v.address.toLowerCase() === GROVE_USDC.toLowerCase())).toBe(true);
    const usdc = nav.find((v) => v.address.toLowerCase() === GROVE_USDC.toLowerCase());
    expect(usdc?.name).toBe('Grove x Steakhouse USDC');
  });
});
