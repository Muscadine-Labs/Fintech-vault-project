import { describe, expect, it, vi } from 'vitest';
import { readRegistryVaultBalances, vaultDustThreshold } from '@/lib/onchain-positions';
import { getRegistryVaultList } from '@/lib/vaults';

describe('vaultDustThreshold', () => {
  it('is 1e-9 of a token for 18-decimal assets and one base unit otherwise', () => {
    expect(vaultDustThreshold(18)).toBe(BigInt(1_000_000_000));
    expect(vaultDustThreshold(8)).toBe(BigInt(1));
    expect(vaultDustThreshold(6)).toBe(BigInt(1));
  });
});

describe('readRegistryVaultBalances', () => {
  it('drops force-exit dust but keeps real positions', async () => {
    const [dust, real, empty] = getRegistryVaultList();
    const sharesByVault: Record<string, bigint> = {
      [dust.address.toLowerCase()]: BigInt(40_000),
      [real.address.toLowerCase()]: BigInt(10) ** BigInt(18),
      [empty.address.toLowerCase()]: BigInt(1),
    };
    const assetsByShares = (vault: string) => {
      if (vault === real.address.toLowerCase()) return BigInt(1_000_000);
      return BigInt(0);
    };
    const publicClient = {
      multicall: vi.fn(async ({ contracts }: { contracts: Array<{ address: string; functionName: string; args: [bigint | string] }> }) =>
        contracts.map((c) =>
          c.functionName === 'balanceOf'
            ? sharesByVault[c.address.toLowerCase()] ?? BigInt(0)
            : assetsByShares(c.address.toLowerCase())
        )
      ),
    };
    const balances = await readRegistryVaultBalances(
      publicClient as never,
      '0x00000000000000000000000000000000000000a1'
    );
    expect(balances![dust.address.toLowerCase()]).toEqual({ shares: BigInt(0), assets: BigInt(0) });
    expect(balances![empty.address.toLowerCase()]).toEqual({ shares: BigInt(0), assets: BigInt(0) });
    expect(balances![real.address.toLowerCase()].assets).toBe(BigInt(1_000_000));
  });
});
