import { describe, expect, it } from 'vitest';
import {
  findVaultByAddress,
  getAllRegistryVaults,
  preferredVaultName,
  vaultAddressPlaceholderName,
} from '@/lib/vault-utils';

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
