import { describe, expect, it } from 'vitest';
import { encodeFunctionData } from 'viem';
import { vaultV2Abi } from '@/lib/onchain/abis';
import {
  activityRoles,
  describeVaultCall,
  matchPendingConfig,
  pendingStatus,
  signedAllocationAmount,
  sortActivity,
  type VaultActivityRow,
} from '@/lib/morpho/vault-activity';
import { adapterAllocationRaw, summarizeAdapter } from '@/lib/morpho/vault-adapter-summary';

const setMaxRate = encodeFunctionData({ abi: vaultV2Abi, functionName: 'setMaxRate', args: [1n] });
const submitMaxRate = encodeFunctionData({ abi: vaultV2Abi, functionName: 'submit', args: [setMaxRate] });

describe('describeVaultCall', () => {
  it('names direct and submitted calls', () => {
    expect(describeVaultCall(setMaxRate)).toBe('setMaxRate');
    expect(describeVaultCall(submitMaxRate)).toBe('Submit setMaxRate');
    expect(describeVaultCall('0xdeadbeef')).toBeNull();
    expect(describeVaultCall(null)).toBeNull();
  });
});

describe('signedAllocationAmount', () => {
  it('prefers the indexed change', () => {
    expect(signedAllocationAmount({ type: 'Allocate', assets: 575, change: 576 })).toBe('576');
    expect(signedAllocationAmount({ type: 'Deallocate', assets: 4, change: -4 })).toBe('-4');
  });
  it('signs assets by type when change is missing', () => {
    expect(signedAllocationAmount({ type: 'Deallocate', assets: '10', change: null })).toBe('-10');
    expect(signedAllocationAmount({ type: 'Allocate', assets: null, change: null })).toBeNull();
  });
});

describe('activityRoles', () => {
  const roles = {
    owner: '0xA',
    curator: '0xB',
    allocators: ['0xC', '0xD'],
    sentinels: ['0xc'],
    publicAllocator: '0xD',
  };
  it('lists every role an address holds, case-insensitively', () => {
    expect(activityRoles('0xc', roles)).toEqual(['Allocator', 'Sentinel']);
    expect(activityRoles('0xa', roles)).toEqual(['Owner']);
  });
  it('labels the Public Allocator on its own', () => {
    expect(activityRoles('0xd', roles)).toEqual(['Public Allocator']);
  });
  it('returns nothing for unknown or missing actors', () => {
    expect(activityRoles('0xE', roles)).toEqual([]);
    expect(activityRoles(null, roles)).toEqual([]);
  });
});

describe('sortActivity', () => {
  it('orders newest first', () => {
    const row = (id: string, timestamp: number) => ({ id, timestamp }) as VaultActivityRow;
    expect(sortActivity([row('a', 1), row('b', 3), row('c', 2)]).map((r) => r.id)).toEqual([
      'b',
      'c',
      'a',
    ]);
  });
  it('puts pending submissions without an executed row first', () => {
    const rows = [
      { id: 'old', timestamp: 1, actor: '0x1' },
      { id: 'pending', timestamp: 99, actor: null, pending: { validAt: 99 } },
      { id: 'new', timestamp: 50, actor: '0x1' },
    ] as VaultActivityRow[];
    expect(sortActivity(rows).map((r) => r.id)).toEqual(['pending', 'new', 'old']);
  });
});

describe('summarizeAdapter', () => {
  it('sums withdrawable liquidity and weights the rate by allocation', () => {
    const s = summarizeAdapter({
      allocationUsd: 300,
      markets: [
        { allocationUsd: 100, liquidityUsd: 50, supplyApy: 0.1 },
        { allocationUsd: 200, liquidityUsd: 1000, supplyApy: 0.04 },
        { allocationUsd: 0, liquidityUsd: 10, supplyApy: 0.5 },
      ],
    });
    expect(s.liquidityUsd).toBe(250);
    expect(s.rate).toBeCloseTo(0.06);
    expect(s.marketsCount).toBe(3);
    expect(s.activeMarketsCount).toBe(2);
  });
  it('uses the child vault for a Vault V2 adapter', () => {
    const s = summarizeAdapter({
      allocationUsd: 100,
      markets: [],
      underlying: { liquidityUsd: 40, avgNetApy: null, netApy: 0.05 },
    });
    expect(s.liquidityUsd).toBe(40);
    expect(s.rate).toBe(0.05);
  });
});

describe('matchPendingConfig', () => {
  const setMaxRate2 = encodeFunctionData({ abi: vaultV2Abi, functionName: 'setMaxRate', args: [2n] });
  const TX = '0xAB';
  const pending = [
    { txHash: '0xab', data: setMaxRate, validAt: 100 },
    { txHash: '0xab', data: setMaxRate2, validAt: 300 },
  ];

  it('matches each submit in a batch to its own config', () => {
    const calls = [
      { submittedData: setMaxRate2.toLowerCase() },
      { submittedData: setMaxRate.toLowerCase() },
      { submittedData: null },
    ];
    const taken = new Set<number>();
    const matched = calls.map((c) => {
      const i = matchPendingConfig({ txHash: TX, submittedData: c.submittedData }, pending, taken);
      if (i >= 0) taken.add(i);
      return i >= 0 ? pending[i].validAt : null;
    });
    expect(matched).toEqual([300, 100, null]);
  });

  it('does not match another tx or a claimed config', () => {
    expect(
      matchPendingConfig({ txHash: '0xcd', submittedData: setMaxRate.toLowerCase() }, pending, new Set())
    ).toBe(-1);
    expect(
      matchPendingConfig({ txHash: TX, submittedData: setMaxRate.toLowerCase() }, pending, new Set([0]))
    ).toBe(-1);
  });
});

describe('pendingStatus', () => {
  it('never treats a missing unlock time as executable', () => {
    expect(pendingStatus(0, 1000)).toBe('unknown');
    expect(pendingStatus(null, 1000)).toBe('unknown');
    expect(pendingStatus(900, 1000)).toBe('executable');
    expect(pendingStatus(1100, 1000)).toBe('timelocked');
  });
});

describe('adapterAllocationRaw', () => {
  it('prefers the on-chain raw string', () => {
    expect(adapterAllocationRaw('123456789012345678901', 5)).toBe(123456789012345678901n);
  });

  it('treats a non-finite governance amount as unknown instead of throwing', () => {
    expect(adapterAllocationRaw(null, Number.NaN)).toBeNull();
    expect(adapterAllocationRaw(undefined, Number.POSITIVE_INFINITY)).toBeNull();
    expect(adapterAllocationRaw('not-a-number', 42.9)).toBe(42n);
  });
});
