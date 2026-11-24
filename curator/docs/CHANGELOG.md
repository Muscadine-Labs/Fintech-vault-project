# Changelog

Notes from before this student template are not included.

## 2026-11-24 — Upstream sync to curator 83829a6

- wagmi 3, Reown AppKit 2 and `@wagmi/connectors` 8. Code uses `useConnection` (not `useAccount`) and `mutateAsync` on mutation hooks.
- Base Account and Coinbase Wallet connectors are lazy (`lib/wallet/lazy-connectors.ts`): neither SDK loads on page load; Base Account telemetry is off. `coinbase-connector.ts` is gone.
- AppKit font variables are `inherit` (no `fonts.reown.com` requests); npm scripts set `NEXT_TELEMETRY_DISABLED=1`.
- Dependency patches and overrides from upstream. Node 26, same as upstream.
- `public/manifest.json` (Safe App manifest) removed; CSP is `frame-ancestors 'none'`.

## 2026-11-24 — Source under src, markets in one route tree

- Curator source now lives in `src/app`, `src/components`, and `src/lib`, matching the depositor app. `@/` points at `src/`.
- Blue detail is `/markets/blue/[id]`. Midnight detail is `/markets/midnight/[id]`. `/market/blue/[id]`, `/midnight/[id]`, and `/market/midnight/[id]` redirect there.

## 2026-11-24 — Multisig Safe removed

- Vault writes sign from the connected wallet only. The Safe workspace, Safe API routes, Transaction Service client, and `@safe-global` packages are gone.
- `/safe` and `/curator/safe` redirect to `/curator`.
- Activity shows Morpho allocations and pending governance submits. It no longer reads executed governance from Safe history.
- Role checks for confirm live in `lib/vault/write-destination.ts`.

## 2026-11-15 — Second review pass

- `batchVaultV2ByAddress` single-vault retries map only GraphQL errors to null; a timeout / 429 / network error fails the read, so a list with a real vault missing is never cached.
- `GET /api/markets/[marketId]` validates the id before the rate limiter (junk ids no longer mint buckets).
- The Safe queue counts only signatures that recover to their signer, matching execute.
- `%` input accepts a trailing `%` (`50%`).
- Vault config takes an optional `assetDecimals` for assets outside the known symbols; Safe previews format with it.

## 2026-11-15 — Review fixes (Safe, parsing, batch fallbacks)

- Safe execution outcome reads both event layouts: Safe v1.3.0 (`txHash` in `data`) and v1.4.1+ (`txHash` indexed in `topics[1]`).
- Execute drops owner signatures that do not recover to their signer (`lib/safe/verify-signature.ts`).
- MultiSend batching also checks the Transaction Service and refuses when a proposal outside the batch has a later nonce.
- `parseHumanTokenInput` and `% input` parse strictly; rebalance preview uses display amounts.
- `batchVaultV2ByAddress` retries each vault alone only on a GraphQL error; a 429 / timeout / network failure is not split into N requests. Malformed ECDSA signatures are dropped at execute (only v 0/1 go to the chain unchecked). Token metadata cache is capped at 5,000 entries. `GET /api/markets/[marketId]` returns 400 for a malformed id.
- Safe `info` / `balances` routes serve configured Safes only and are rate limited. The activity feed skips placeholder Safes.

## 2026-11-15 — Small fixes

- Probe reads use an unbatched client so a multicall-induced failure is not cached as a miss.
- `protocol-stats` falls back per vault only on GraphQL errors; a timeout fails the refresh instead of a slower second round.

## 2026-11-14 — Fewer upstream calls

- `protocol-stats`: TVL histories and first depositor pages are one aliased Morpho query each, with per-vault fallback.
- Markets: Midnight token metadata and prices come from one `assets(where: { address_in })` read (`prefetchAssets`).
- Server `publicClient` batches same-tick reads (Multicall3 + JSON-RPC batch).
- Tab switches join an in-flight on-chain refetch (`cancelRefetch: false`).
