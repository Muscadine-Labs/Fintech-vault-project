'use client';

import { useQuery } from '@tanstack/react-query';
import {
  createPublicClient,
  http,
  parseAbi,
  type Address,
} from 'viem';
import { base } from 'viem/chains';

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY?.trim();

/** Basename contracts on Base (https://github.com/base/basenames). */
const BASENAME_REVERSE_REGISTRAR =
  '0x79ea96012eea67a83431f1701b3dff7e37f9e282' as Address;
const BASENAME_L2_RESOLVER =
  '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD' as Address;

const reverseRegistrarAbi = parseAbi([
  'function node(address addr) view returns (bytes32)',
]);

const l2ResolverAbi = parseAbi([
  'function name(bytes32 node) view returns (string)',
]);

function baseRpcUrl(): string {
  if (alchemyApiKey) {
    return `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
  }
  return 'https://mainnet.base.org';
}

const baseClient = createPublicClient({
  chain: base,
  transport: http(baseRpcUrl()),
});

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Reverse-resolve Basename via Base ReverseRegistrar + L2Resolver.
 */
async function resolveBasenameOnBase(address: Address): Promise<string | null> {
  const node = await baseClient.readContract({
    address: BASENAME_REVERSE_REGISTRAR,
    abi: reverseRegistrarAbi,
    functionName: 'node',
    args: [address],
  });

  const name = await baseClient.readContract({
    address: BASENAME_L2_RESOLVER,
    abi: l2ResolverAbi,
    functionName: 'name',
    args: [node],
  });

  const trimmed = name?.trim();
  return trimmed ? trimmed : null;
}

/** Basename (`.base.eth`) on Base. Falls back to a truncated address. */
export function useWalletDisplayName(address?: Address) {
  const query = useQuery({
    queryKey: ['wallet-display-name', address?.toLowerCase()],
    enabled: Boolean(address),
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<{ name: string | null; truncated: string }> => {
      if (!address) {
        return { name: null, truncated: '' };
      }

      const truncated = truncateAddress(address);

      const basename = await resolveBasenameOnBase(address).catch(() => null);

      return {
        name: basename,
        truncated,
      };
    },
  });

  const truncated = address ? truncateAddress(address) : '';
  const displayName = query.data?.name || truncated;

  return {
    displayName,
    primaryName: query.data?.name ?? null,
    truncated,
    isLoading: query.isLoading,
  };
}
