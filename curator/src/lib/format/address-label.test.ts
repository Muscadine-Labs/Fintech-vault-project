import { describe, expect, it } from 'vitest';
import {
  getDepositorLabel,
  resolveDepositorLabel,
} from '@/lib/format/address-label';

const GROVE_USDC = '0xbeef0786756810478b88982DE00F3CD7fdB8e7c7';

describe('resolveDepositorLabel', () => {
  it('labels strategy vaults that appear as holders', () => {
    const resolved = resolveDepositorLabel(GROVE_USDC);
    expect(resolved?.kind).toBe('vault');
    expect(resolved?.label).toBe('Grove x Steakhouse USDC');
  });

  it('returns null for ordinary wallets', () => {
    expect(
      resolveDepositorLabel('0x9999999999999999999999999999999999999999')
    ).toBeNull();
    expect(getDepositorLabel('0x9999999999999999999999999999999999999999')).toBeNull();
  });
});
