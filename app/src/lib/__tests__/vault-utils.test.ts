import { describe, expect, it } from 'vitest';
import {
  findVaultByAddress,
  getAllRegistryVaults,
  preferredVaultName,
  sortVaultsForDisplay,
  vaultAddressPlaceholderName,
} from '@/lib/vault-utils';
import type { Vault } from '@/types/vault';

const GROVE_USDC = '0xbeef0786756810478b88982de00f3cd7fdb8e7c7';
const GAUNTLET_PRIME = '0x050ce30b927da55177a4914ec73480238bad56f0';
const GAUNTLET_FRONTIER = '0x1deefabee758aabdc29a542b24ca3b75afd56765';

describe('registry', () => {
  it('lists the configured vaults', () => {
    expect(
      getAllRegistryVaults()
        .map((vault) => vault.address.toLowerCase())
        .sort()
    ).toEqual([GROVE_USDC, GAUNTLET_PRIME, GAUNTLET_FRONTIER].sort());
  });

  it('has no page for an address that is not in the registry', () => {
    expect(findVaultByAddress('0x036a01efddc87f6634ffde0533ee528b90fc7a45')).toBeNull();
  });
});

describe('preferredVaultName', () => {
  const address = '0x1234567890abcdef1234567890abcdef12345678';
  it('prefers the Morpho name', () => {
    expect(preferredVaultName('Morpho Name', 'Positions Name', address)).toBe('Morpho Name');
  });
  it('lets a real fallback beat the address placeholder', () => {
    expect(preferredVaultName(vaultAddressPlaceholderName(address), 'Positions Name', address)).toBe('Positions Name');
    expect(preferredVaultName('  ', 'Positions Name', address)).toBe('Positions Name');
  });
  it('uses the placeholder only when nothing else has a name', () => {
    expect(preferredVaultName(undefined, '', address)).toBe(vaultAddressPlaceholderName(address));
  });
});

describe('sortVaultsForDisplay', () => {
  // Morpho has no name for some external vaults; one in the list used to crash the dashboard.
  it('does not throw when a vault has no name', () => {
    const named = { address: GAUNTLET_PRIME, name: 'USDC Prime', symbol: 'USDC', chainId: 8453 } as Vault;
    const nameless = { address: GROVE_USDC, symbol: 'USDC', chainId: 8453 } as unknown as Vault;
    const sorted = sortVaultsForDisplay([named, nameless], [], () => 0);
    expect(sorted.map((v) => v.address)).toEqual([GROVE_USDC, GAUNTLET_PRIME]);
  });
});

describe('preferredVaultName for an unnamed external vault', () => {
  it('falls back to the address placeholder', () => {
    const address = '0x6694eAE513FEb17b2483b2f73FA9eA826CF1f5dF';
    expect(preferredVaultName('', undefined, address)).toBe(vaultAddressPlaceholderName(address));
  });
});
