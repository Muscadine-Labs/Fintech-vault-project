import { getAddress, type Address } from 'viem';

function roleListIncludesAddress(
  roleHolders: ReadonlyArray<string> | undefined,
  address: string
): boolean {
  if (!roleHolders?.length) return false;
  const target = getAddress(address).toLowerCase();
  return roleHolders.some((holder) => {
    try {
      return getAddress(holder).toLowerCase() === target;
    } catch {
      return false;
    }
  });
}

export function walletIsDirectRoleHolder(
  wallet: Address | string | undefined,
  roleHolders: ReadonlyArray<string> | undefined
): boolean {
  if (!wallet || !roleHolders?.length) return false;
  return roleListIncludesAddress(roleHolders, wallet);
}

export function walletCanSignCurator(
  wallet: Address | string | undefined,
  curator: string | null | undefined
): boolean {
  return walletIsDirectRoleHolder(wallet, curator ? [curator] : []);
}

export function walletCanSignAllocation(
  wallet: Address | string | undefined,
  allocators: ReadonlyArray<string> | undefined
): boolean {
  return walletIsDirectRoleHolder(wallet, allocators);
}

export function walletCanSignSentinel(
  wallet: Address | string | undefined,
  sentinels: ReadonlyArray<string> | undefined
): boolean {
  return walletIsDirectRoleHolder(wallet, sentinels);
}

export function walletCanRevokePending(
  wallet: Address | string | undefined,
  curator: string | null | undefined,
  sentinels: ReadonlyArray<string> | undefined
): boolean {
  return (
    walletCanSignSentinel(wallet, sentinels) || walletCanSignCurator(wallet, curator)
  );
}

export const PENDING_ACCEPT_WALLET_HINT =
  'Connect any wallet in the top bar — allocator, curator, or sentinel role is not required to accept after timelock.';

export const PENDING_REVOKE_WALLET_HINT =
  'Connect the on-chain sentinel or curator wallet for this vault.';
