import type { Address } from 'viem';
import { BASE_CHAIN_ID } from '@/lib/constants/core';

/**
 * Vault V2 Blue Public Allocator deployments (Morpho `vaultV2BluePublicAllocator`).
 * Distinct from MetaMorpho V1 `publicAllocator` flow-cap contracts.
 * @see https://docs.morpho.org/learn/concepts/public-allocator/
 */
const VAULT_V2_PUBLIC_ALLOCATOR_BY_CHAIN: Record<number, Address> = {
  [BASE_CHAIN_ID]: '0xAED282B8aD9257BB1272e93aE63A32A53621e412',
} as const satisfies Record<number, Address>;

/** Public Morpho allocator on Base (not your Allocator Safe). */
export const PUBLIC_ALLOCATOR_ADDRESS: Address =
  VAULT_V2_PUBLIC_ALLOCATOR_BY_CHAIN[BASE_CHAIN_ID];

export function getVaultV2PublicAllocatorAddress(chainId: number): Address | null {
  return VAULT_V2_PUBLIC_ALLOCATOR_BY_CHAIN[chainId] ?? null;
}

export function isVaultV2PublicAllocatorAddress(address: string): boolean {
  const needle = address.toLowerCase();
  return Object.values(VAULT_V2_PUBLIC_ALLOCATOR_BY_CHAIN).some(
    (a) => a.toLowerCase() === needle
  );
}
