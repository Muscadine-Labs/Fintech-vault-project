import { gql } from 'graphql-request';
import { getAddress } from 'viem';
import { morphoGraphQLClient } from '@/lib/morpho/graphql-client';
import { withServerResponseCache } from '@/lib/api/server-response-cache';
import { API_CACHE_MAX_AGE_MS } from '@/lib/api/response-cache';
import {
  describeVaultCall,
  signedAllocationAmount,
  sortActivity,
  type VaultActivityRow,
} from '@/lib/morpho/vault-activity';

const ALLOCATION_ROWS = 200;

const VAULT_ACTIVITY_QUERY = gql`
  query VaultActivity($vaultAddress: String!, $chainId: Int!, $first: Int!) {
    vaultV2AllocationTransactions(
      vaultAddress: $vaultAddress
      chainId: $chainId
      first: $first
      orderBy: Timestamp
      orderDirection: Desc
    ) {
      items {
        txHash
        logIndex
        timestamp
        type
        assets
        change
        adapter
        sender
        ids
      }
    }
    vault: vaultV2ByAddress(address: $vaultAddress, chainId: $chainId) {
      pendingConfigs(first: 100) {
        items {
          functionName
          txHash
          validAt
          data
        }
      }
    }
  }
`;

type GraphResponse = {
  vaultV2AllocationTransactions?: {
    items?: Array<{
      txHash: string;
      logIndex?: number | null;
      timestamp: number | string;
      type?: string | null;
      assets?: string | number | null;
      change?: string | number | null;
      adapter?: string | null;
      sender?: string | null;
      ids?: string[] | null;
    } | null> | null;
  } | null;
  vault?: {
    pendingConfigs?: {
      items?: Array<{
        functionName?: string | null;
        txHash?: string | null;
        validAt?: number | string | null;
        data?: string | null;
      } | null> | null;
    } | null;
  } | null;
};

export type VaultActivityResponse = {
  rows: VaultActivityRow[];
};

export async function fetchVaultActivity(
  vaultAddress: string,
  chainId: number
): Promise<VaultActivityResponse> {
  const vault = getAddress(vaultAddress);
  return withServerResponseCache(
    `vault-activity:${chainId}:${vault.toLowerCase()}`,
    API_CACHE_MAX_AGE_MS,
    async () => {
      const data = await morphoGraphQLClient.request<GraphResponse>(VAULT_ACTIVITY_QUERY, {
        vaultAddress: vault,
        chainId,
        first: ALLOCATION_ROWS,
      });

      const allocationRows: VaultActivityRow[] = (data.vaultV2AllocationTransactions?.items ?? [])
        .filter((x): x is NonNullable<typeof x> => Boolean(x?.txHash))
        .map((tx, i) => ({
          id: `alloc-${tx.txHash}-${tx.logIndex ?? i}`,
          timestamp: Number(tx.timestamp),
          type: 'allocation' as const,
          action: /dealloc/i.test(tx.type ?? '') ? 'deallocate' : 'allocate',
          actor: tx.sender ?? null,
          amount: signedAllocationAmount(tx),
          adapter: tx.adapter ?? null,
          ids: (tx.ids ?? []).filter(Boolean),
          txHash: tx.txHash,
        }));

      const pendingConfigs = (data.vault?.pendingConfigs?.items ?? [])
        .filter((p): p is NonNullable<typeof p> => Boolean(p?.functionName))
        .map((p) => ({
          txHash: p.txHash ?? null,
          data: p.data ?? null,
          functionName: p.functionName!,
          validAt: Number(p.validAt ?? 0),
        }));

      const pendingOnly: VaultActivityRow[] = pendingConfigs.map((p, i) => ({
          id: `pending-${p.txHash ?? 'unknown'}-${i}`,
          timestamp: p.validAt,
          type: 'governance' as const,
          action: `Submit ${describeVaultCall(p.data) ?? p.functionName}`,
          actor: null,
          amount: null,
          adapter: null,
          ids: [],
          txHash: p.txHash,
          pending: { validAt: p.validAt },
        }));

      return {
        rows: sortActivity([...allocationRows, ...pendingOnly]),
      };
    }
  );
}
