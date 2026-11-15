import type { Address } from 'viem';

export const SAFE_ROLES = ['owner', 'curator', 'allocator', 'sentinel'] as const;

export type SafeRole = (typeof SAFE_ROLES)[number];

export type SafeAccountConfig = {
  role: SafeRole;
  label: string;
  address: Address;
  description: string;
};

/**
 * Vault-role Safes on Base (chainId 8453).
 * Replace every address with your own Safe. These placeholders are not real Safes.
 */
export const SAFE_ACCOUNTS: ReadonlyArray<SafeAccountConfig> = [
  {
    role: 'owner',
    label: 'Owner',
    address: '0x1111111111111111111111111111111111111111',
    description: 'Owner multisig',
  },
  {
    role: 'curator',
    label: 'Curator',
    address: '0x2222222222222222222222222222222222222222',
    description: 'Curator multisig',
  },
  {
    role: 'allocator',
    label: 'Allocator',
    address: '0x3333333333333333333333333333333333333333',
    description: 'Allocator multisig — vault rebalances are queued here',
  },
  {
    role: 'sentinel',
    label: 'Sentinel',
    address: '0x4444444444444444444444444444444444444444',
    description: 'Sentinel multisig',
  },
] as const;

/** Default Safe tab when allocation writes are queued. */
export const ALLOCATION_SAFE_ROLE: SafeRole = 'allocator';

/** Safe that signs vault sentinel writes (cap decreases, deallocate). */
export const SENTINEL_SAFE_ROLE: SafeRole = 'sentinel';

/** Safe that queues curator timelock submits (liquidity adapter, etc.). */
export const CURATOR_SAFE_ROLE: SafeRole = 'curator';

export function isSafeRole(value: string): value is SafeRole {
  return (SAFE_ROLES as ReadonlyArray<string>).includes(value);
}

export function getSafeByRole(role: SafeRole): SafeAccountConfig {
  const account = SAFE_ACCOUNTS.find((s) => s.role === role);
  if (!account) throw new Error(`Unknown Safe role: ${role}`);
  return account;
}

export function getSafeByAddress(address: string): SafeAccountConfig | undefined {
  const normalized = address.toLowerCase();
  return SAFE_ACCOUNTS.find((s) => s.address.toLowerCase() === normalized);
}

/** Placeholder rows (0x1111…, 0x2222…) are not deployed Safes. Do not read them on chain. */
export function isPlaceholderSafeAddress(address: string): boolean {
  const body = address.toLowerCase().replace(/^0x/, '');
  return /^([\da-f])\1+$/.test(body);
}

export function isConfiguredSafeAccount(account: SafeAccountConfig): boolean {
  return !isPlaceholderSafeAddress(account.address);
}

export function configuredSafeAccounts(): SafeAccountConfig[] {
  return SAFE_ACCOUNTS.filter(isConfiguredSafeAccount);
}
