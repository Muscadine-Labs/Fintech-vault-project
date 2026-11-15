export type VaultPageAccess = 'allowed' | 'pending' | 'denied';

/** This wallet's share balance in the vault, read on chain. `unknown` = no wallet or the read failed. */
export type OnChainShareState = 'held' | 'empty' | 'loading' | 'unknown';

/** Vault detail page — allow depositors, exit holders and vaults the explorer lists; redirect everyone else. */
export function resolveVaultPageAccess(options: {
  vaultAddress: string;
  /** Vaults the explorer lists for this wallet. */
  listedVaultAddresses: ReadonlySet<string>;
  depositedAddresses: ReadonlySet<string>;
  walletStatus: 'connected' | 'connecting' | 'reconnecting' | 'disconnected';
  walletAddress?: string | null;
  positionsResolvedFor: string | null;
  /** On-chain balance. Covers holders when the Morpho positions API fails or lags. */
  onChainShares: OnChainShareState;
}): VaultPageAccess {
  const key = options.vaultAddress.toLowerCase();
  if (options.listedVaultAddresses.has(key)) return 'allowed';
  if (options.depositedAddresses.has(key)) return 'allowed';
  if (options.onChainShares === 'held') return 'allowed';
  if (options.onChainShares === 'loading') return 'pending';
  if (options.onChainShares === 'empty') return 'denied';

  if (
    options.walletStatus === 'connecting' ||
    options.walletStatus === 'reconnecting'
  ) {
    return 'pending';
  }

  if (options.walletStatus === 'connected') {
    const wallet = options.walletAddress?.toLowerCase();
    const resolved = options.positionsResolvedFor?.toLowerCase();
    if (!wallet || !resolved || resolved !== wallet) {
      return 'pending';
    }
  }

  return 'denied';
}
