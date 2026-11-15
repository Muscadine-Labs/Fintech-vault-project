import { describe, expect, it } from 'vitest';
import { encodeFunctionData, erc20Abi, getAddress, type Hex } from 'viem';
import {
  describeSafeTxSource,
  inferSafeTxSource,
  resolveSafePendingPreview,
  resolveVaultAddressFromPending,
  safePendingWarnings,
} from '@/lib/safe/decode-vault-calldata-preview';
import { vaultV2Abi } from '@/lib/onchain/abis';
import { getSafeByRole } from '@/lib/safe/config';
import type { SafePendingTransaction } from '@/lib/safe/types';

const RECIPIENT = getAddress('0x000000000000000000000000000000000000dEaD');
const ZERO = getAddress('0x0000000000000000000000000000000000000000');
const USDC = getAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
/** A tracked vault — its shares are an ERC-20 at the same address. */
const VAULT_SHARES = getAddress('0xbeef0786756810478b88982DE00F3CD7fdB8e7c7');
const transferData = (amount: bigint) =>
  encodeFunctionData({ abi: erc20Abi, functionName: 'transfer', args: [RECIPIENT, amount] });

/** Mirrors what service-sync builds for a transaction imported with no preview. */
function imported(to: string, data: Hex, value = '0'): SafePendingTransaction {
  return {
    id: 'x',
    safeRole: 'allocator',
    safeAddress: getSafeByRole('allocator').address,
    safeTxHash: '0xabc',
    to: getAddress(to),
    value,
    data,
    operation: 0,
    safeTxGas: '0',
    baseGas: '0',
    gasPrice: '0',
    gasToken: ZERO,
    refundReceiver: ZERO,
    nonce: '23',
    status: 'awaiting_signatures',
    proposer: null,
    description: 'Safe transaction',
    source: inferSafeTxSource(getAddress(to), data, value),
    preview: null,
    signatures: [],
    createdAt: '',
    updatedAt: '',
  } as unknown as SafePendingTransaction;
}

describe('inferSafeTxSource', () => {
  it('classifies a vault-share transfer as a transfer, not a vault write', () => {
    const source = inferSafeTxSource(VAULT_SHARES, transferData(1_500_000_000_000_000_000n));
    expect(source.type).toBe('transfer');
    if (source.type !== 'transfer') return;
    expect(source.recipient).toBe(RECIPIENT);
    expect(source.amount).toBe('1500000000000000000');
  });

  it('classifies a native value transfer', () => {
    const source = inferSafeTxSource(RECIPIENT, '0x', '1000000000000000');
    expect(source).toMatchObject({ type: 'transfer', token: 'native', tokenSymbol: 'ETH' });
  });

  it('still classifies real vault calldata as a vault operation', () => {
    const data = encodeFunctionData({
      abi: vaultV2Abi,
      functionName: 'deallocate',
      args: [RECIPIENT, '0x', 5_000_000n],
    });
    expect(inferSafeTxSource(VAULT_SHARES, data)).toMatchObject({ type: 'allocation' });
  });

  it('falls back to manual for an unrecognised target and calldata', () => {
    expect(inferSafeTxSource(RECIPIENT, '0xdeadbeef')).toEqual({ type: 'manual' });
  });
});

describe('describeSafeTxSource', () => {
  it('labels a Curator-origin transfer as a send, not a vault action', () => {
    const source = inferSafeTxSource(USDC, transferData(1_000_000n));
    expect(describeSafeTxSource(source, USDC)).toMatch(/^Send /);
    expect(describeSafeTxSource(source, USDC)).not.toMatch(/Vault/i);
  });

  it('labels native ETH sends', () => {
    const source = inferSafeTxSource(RECIPIENT, '0x', '1');
    expect(describeSafeTxSource(source, RECIPIENT)).toContain('ETH');
  });
});

describe('resolveSafePendingPreview — token movements', () => {
  it('shows amount and recipient for a vault-share transfer', () => {
    // Regression: this previously rendered "Undecoded calldata" with no
    // recipient, so an owner signed without seeing where funds were going.
    const preview = resolveSafePendingPreview(
      imported(VAULT_SHARES, transferData(1_500_000_000_000_000_000n))
    );
    expect(preview.title).toContain('1.500000');
    expect(preview.changes[0].subtitle).toContain(RECIPIENT);
    expect(preview.changes[0].delta).toContain('−1.500000');
  });

  it('uses the token symbol and decimals for a known ERC-20', () => {
    const preview = resolveSafePendingPreview(imported(USDC, transferData(2_500_000n)));
    expect(preview.title).toBe('Send 2.500000 USDC');
  });

  it('shows raw units and warns for an unknown token', () => {
    const unknown = getAddress('0x1111111111111111111111111111111111111111');
    const preview = resolveSafePendingPreview(imported(unknown, transferData(42n)));
    expect(preview.title).toContain('42 raw units');
    expect(preview.footnote).toContain('decimals unknown');
  });

  it('decodes a native ETH transfer that carries no calldata', () => {
    const preview = resolveSafePendingPreview(imported(RECIPIENT, '0x', '1000000000000000'));
    expect(preview.title).toBe('Send 0.001000 ETH');
  });
});

describe('resolveVaultAddressFromPending', () => {
  it('does not link a share transfer to the vault page', () => {
    expect(
      resolveVaultAddressFromPending(imported(VAULT_SHARES, transferData(1n)))
    ).toBeNull();
  });

  it('still links a genuine vault write', () => {
    const data = encodeFunctionData({
      abi: vaultV2Abi,
      functionName: 'deallocate',
      args: [RECIPIENT, '0x', 5_000_000n],
    });
    expect(resolveVaultAddressFromPending(imported(VAULT_SHARES, data))).toBe(VAULT_SHARES);
  });
});

describe('vault multicall with non-vault inner calls', () => {
  const deallocate = encodeFunctionData({
    abi: vaultV2Abi,
    functionName: 'deallocate',
    args: [RECIPIENT, '0x', 1_000_000n],
  });
  const hidden = encodeFunctionData({
    abi: vaultV2Abi,
    functionName: 'multicall',
    args: [[deallocate, transferData(42n)]],
  });

  it('keeps an undecodable inner call in the preview instead of dropping it', () => {
    const preview = resolveSafePendingPreview(imported(VAULT_SHARES, hidden));
    expect(preview.changes).toHaveLength(2);
    expect(preview.changes.some((c) => c.label === 'ERC-20 transfer')).toBe(true);
    expect(preview.footnote).toMatch(/could not be decoded/);
  });

  it('warns on the queue card even when a stored preview hides it', () => {
    const tx = {
      ...imported(VAULT_SHARES, hidden),
      preview: { title: 'Rebalance', description: '', changes: [{ action: 'deallocate' as const, label: 'x' }] },
    };
    const warnings = safePendingWarnings(tx);
    expect(warnings.blocking).toBe(false);
    expect(warnings.messages[0]).toMatch(/1 call in this vault transaction could not be decoded/);
  });

  it('never labels a DelegateCall as a transfer', () => {
    expect(inferSafeTxSource(RECIPIENT, transferData(1n), '0', 1)).toEqual({ type: 'manual' });
  });
});

describe('accrueInterest preview', () => {
  it('decodes an imported fee claim instead of showing raw calldata', () => {
    const data = encodeFunctionData({ abi: vaultV2Abi, functionName: 'accrueInterest' });
    const preview = resolveSafePendingPreview(imported(VAULT_SHARES, data));
    expect(preview.title).toBe('Claim fees');
    expect(preview.changes).toEqual([
      expect.objectContaining({ action: 'claim', label: 'Claim fees' }),
    ]);
  });
});
