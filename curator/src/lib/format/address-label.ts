import type { Address } from 'viem';
import { isVaultV2PublicAllocatorAddress } from '@/lib/constants/bots';
import {
  getConfiguredVaultDisplayName,
  getVaultByAddress,
} from '@/lib/config/vaults';

export type RoleAddressKind = 'public_allocator' | 'eoa';

export type RoleAddressInfo = {
  address: string;
  label: string;
  kind: RoleAddressKind;
};

export type BotActorKind = 'public_allocator' | 'other';

export type BotActorInfo = {
  address: Address;
  label: string;
  kind: BotActorKind;
};

export type DepositorKind = 'vault';

export type DepositorLabel = {
  address: string;
  label: string;
  kind: DepositorKind;
};

/**
 * Label vault role holders: Public Allocator, otherwise EOA.
 * Unknown addresses are labeled EOA for the Roles UI.
 */
export function resolveRoleAddress(address: string): RoleAddressInfo {
  if (isVaultV2PublicAllocatorAddress(address)) {
    return {
      address,
      label: 'Public Allocator',
      kind: 'public_allocator',
    };
  }

  return {
    address,
    label: 'EOA',
    kind: 'eoa',
  };
}

/** Human label for vault Roles UI (`AddressBadge` with `label="auto"`). */
export function getRoleAddressLabel(address: string): string {
  return resolveRoleAddress(address).label;
}

/**
 * Label known protocol addresses in depositor / holder / tx-user lists.
 * Returns null for ordinary wallets.
 */
export function resolveDepositorLabel(address: string): DepositorLabel | null {
  const vault = getVaultByAddress(address);
  if (vault) {
    return {
      address: vault.address,
      label: getConfiguredVaultDisplayName(vault),
      kind: 'vault',
    };
  }

  return null;
}

export function getDepositorLabel(address: string): string | null {
  return resolveDepositorLabel(address)?.label ?? null;
}

function shortAddressLabel(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/** Resolve a watcher / tx-from address for bot activity UI. */
export function labelForActor(address: string): BotActorInfo {
  const resolved = resolveRoleAddress(address);

  if (resolved.kind === 'public_allocator') {
    return {
      address: address as Address,
      label: resolved.label,
      kind: 'public_allocator',
    };
  }

  return {
    address: address as Address,
    label: shortAddressLabel(address),
    kind: 'other',
  };
}
