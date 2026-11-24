import { encodeFunctionData, getAddress, type Address, type Hex } from 'viem';
import type { PublicAllocatorChange } from '@/lib/morpho/v2-public-allocator-plan';
import { vaultV2BluePublicAllocatorAbi } from '@/lib/onchain/abis';

function asMarketParams(market: readonly [Address, Address, Address, Address, bigint]) {
  const [loanToken, collateralToken, oracle, irm, lltv] = market;
  return { loanToken, collateralToken, oracle, irm, lltv };
}

type PublicAllocatorCall =
  | { functionName: 'setCanPullFromIdle'; args: readonly [Address, boolean] }
  | {
      functionName: 'setAbsoluteCap';
      args: readonly [Address, Address, ReturnType<typeof asMarketParams>, bigint];
    }
  | {
      functionName: 'setCanPullFromMarket';
      args: readonly [Address, Address, ReturnType<typeof asMarketParams>, boolean];
    }
  | { functionName: 'multicall'; args: readonly [readonly Hex[]] };

function callFor(vault: Address, change: PublicAllocatorChange): PublicAllocatorCall {
  if (change.kind === 'idle') {
    return { functionName: 'setCanPullFromIdle', args: [vault, change.next] };
  }
  if (change.kind === 'absoluteCap') {
    return {
      functionName: 'setAbsoluteCap',
      args: [vault, change.adapter, asMarketParams(change.market), change.next],
    };
  }
  return {
    functionName: 'setCanPullFromMarket',
    args: [vault, change.adapter, asMarketParams(change.market), change.next],
  };
}

/** One Public Allocator call, or `multicall` when several settings change together. */
function updateCall(vault: Address, changes: PublicAllocatorChange[]): PublicAllocatorCall {
  if (changes.length === 0) {
    throw new Error('No Public Allocator changes to send.');
  }
  const target = getAddress(vault);
  if (changes.length === 1) return callFor(target, changes[0]!);
  return {
    functionName: 'multicall',
    args: [
      changes.map((change) =>
        encodeFunctionData({ abi: vaultV2BluePublicAllocatorAbi, ...callFor(target, change) })
      ),
    ],
  };
}

/** Calldata for a Public Allocator update. */
export function encodePublicAllocatorUpdate(
  allocator: Address,
  vault: Address,
  changes: PublicAllocatorChange[]
): { to: Address; data: Hex } {
  return {
    to: getAddress(allocator),
    data: encodeFunctionData({
      abi: vaultV2BluePublicAllocatorAbi,
      ...updateCall(vault, changes),
    }),
  };
}

/** `useVaultWrite` config for the same update. */
export function publicAllocatorWriteConfig(
  allocator: Address,
  vault: Address,
  changes: PublicAllocatorChange[]
) {
  return {
    address: getAddress(allocator),
    abi: vaultV2BluePublicAllocatorAbi,
    ...updateCall(vault, changes),
  };
}
