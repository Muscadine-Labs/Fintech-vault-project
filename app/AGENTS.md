# AGENTS.md — Vaults

Instructions for AI agents working in this repo. Full architecture docs live in `CLAUDE.md` — read it before non-trivial changes.

## Working agreement

> **Student repo:** read the root `CLAUDE.md` first. In this repo `TODO.md` is the student setup checklist, not a task list, and the "never push to `main`" rule yields to the user's own git instructions.


1. **Review `TODO.md` at the start of every session.** It is the canonical task list:
   - “TO work on today” → actionable now.
   - “Needs confirmation first” → research or report only; do not implement without user OK.
   - “To work on another day” → backlog; do not start without being asked.
   - Update/remove entries as work completes.
2. **Before every push to GitHub:** run `npm run lint` and `npm run build` locally; both must pass.
3. **Git, branches and PRs:** commit, create feature branches, push them and open PRs without asking first. **Never push to, commit directly on, force-push, or merge into `main`** — changes reach `main` only through a PR the user merges.
4. Keep `CLAUDE.md` and this file updated when conventions or architecture knowledge change.

## Key constraints

- **wagmi must stay on 2.x** (Reown AppKit requirement). **eslint stays on 9.x** until the plugins `eslint-config-next` 16 bundles (`react`, `jsx-a11y`, `import`) accept ESLint 10. Pin **`qr@0.5.5`** in `package.json` overrides (WalletConnect QR `border=0` crash with `qr@0.6.0`). Keep a **root `valtio`** (AppKit/Turbopack `valtio/vanilla` resolve). Keep **`ox` on 0.14.x**, and bump it with `viem` to the `ox` patch that `viem` version depends on (`npm view viem@<version> dependencies.ox`); the `$ox` override otherwise breaks the build. Keep **`allowScripts`** in `package.json` in sync with lockfile versions for `bufferutil`, `keccak`, `unrs-resolver`, `utf-8-validate`, `@reown/appkit`, and `fsevents` (npm 11+ install-script allowlist; silences Vercel `allow-scripts-pending`). Keep Dependabot-patched transitive pins in **`overrides`**: `axios`, `hono`, `js-yaml` 4.3.2, `socket.io-parser`, `brace-expansion@1` / `@5`, `browserslist` 4.29.3, `decode-uri-component` 0.5.0.
- **Base only** (chain id 8453). **v1 MetaMorpho removed** — registry and writes are v2 only.
- **v2 writes:** direct ERC-4626 in `transactionUtilsV2.ts`. WETH vaults take and pay WETH. Force exits are vault `multicall` in `force-withdraw-v2.ts`. No Bundler3. No Morpho npm bundler SDK. Do not route deposits through VaultBundles. Do not add a native-ETH wrap or unwrap. Every write passes `chain: base`; deposit/withdraw refuse a vault whose on-chain asset decimals differ from the registry; a receipt timeout throws `TransactionStillPendingError` (hash shown, no Retry).
- Registry: `src/lib/vaults.ts`. Fields include `type` and `vaultSymbol`. Every registry vault is listed in the explorer. See `CLAUDE.md` § Vault registry.
- **Data sources:** the user's own money (positions, deposit / withdraw amounts, share balances) is read on chain (`readRegistryVaultBalances` merged into `WalletContext`, plus per-page reads). Vault-level data (deposits, TVL, APY, liquidity, prices) and all charts come from APIs. Deposit and withdraw amounts never use API data: deposit MAX is the on-chain wallet balance, and withdraw reads shares, `convertToAssets`, simulation, the planner and instant liquidity (`readInstantLiquidityAssets`) on chain.
- **Deposit gates:** not handled. The app treats every registry vault as open to deposits and does not read `canSendAssets`. See `CLAUDE.md` § Deposit gates. Settings: theme only.
- **No “Powered by Morpho” badge** on vault pages (looks tacky). Morpho attribution is the disclaimer: first-connect advisory, NavBar Protocol link, and review/confirm.
- Use `findVaultByAddress` / `isCuratedVaultAddress` from `src/lib/vault-utils.ts` — never infer vault by asset symbol alone. The first-connect modal is titled **Terms and Risks**: never call it an advisory agreement in UI copy. It is one review-and-accept line, two short sentences, one line that vaults may charge fees, the Legal Documents links and three checkboxes; bump `TERMS_VERSION` (now `1.0.0`) when its copy changes. External (non-registry) vault rows are display-only, with no link. Vault Overview is one page in three layers (key numbers → Performance / Allocation / Risk / Details, with jump links in the sticky header; the APY chart has a dotted time-weighted average line for the selected period; the Overview charts use a time x-axis with evenly spaced ticks from `evenTimeTicks`); see CLAUDE.md → Vault Overview. Do not split it into more tabs. Do not show Morpho `warnings` to users (Curator keeps them); the Risk section is a short strategy description, how markets are screened, pending timelocked changes and links (no live numbers or fact cards). UI copy never mentions services, clients, an advisory relationship, or a company.
- **Request budget:** the dashboard is one grid (layout changes never remount the chart); position history goes through `fetchPositionHistoryJson` (60s client cache, cleared on balance refresh, nothing stored for 2 minutes after a transaction); wallet token balances are one multicall over the registry vault assets; prices are one cached `/api/prices` call; the transact panel uses `refreshBalancesIfStale`. Vault names: `preferredVaultName` (Morpho name, then positions / registry name, the `Vault 0x…` placeholder last).
- Use `logger` from `src/lib/logger.ts`, not `console.log`.
- **Token display decimals:** UI via `getDisplayFractionDigits` — USDC **6**, cbBTC/ETH/WETH **8**. Prefer raw `bigint` amounts. **Transactions** always use full token decimals (`formatBigIntForInput` — ETH 18, cbBTC 8, USDC 6). Chart axes stay compact.
- **No developer / over-balance bypass mode** — `VaultVersionContext` removed. Explorer filters default to All for type/asset; transact blocks amounts over balance.

## Dashboard & positions

- **Wallet strip:** Total / Wallet (liquid) / Vaults USD (`WalletOverview`).
- **Your Vaults** (dashboard): **v2** positions only (registry + external Morpho v2 vaults).
- **Morpho Vaults total** includes **all** user v2 positions from Morpho (`/api/user/morpho-positions`), not only registry vaults.
- **External vaults** (not in `vaults.ts`): shown on dashboard / explorer wallet filters with an **External** label, **not clickable**. Navigation uses `isCuratedVaultAddress()`; `/vault/v2/{external}` redirects home.
- **Portfolio chart:** v2 positions via `/api/user/morpho-positions` + `/api/vault/v2/.../position-history` (`aggregatePortfolioHistory` in `portfolio-utils.ts`). Keep zero-share v2 rows for history when `includeEmpty=true`.
- **Morpho positions fetch:** `WalletContext` clears on wallet switch, keeps last snapshot on soft-fail for the same wallet, and ignores stale responses after a switch. Server retries transient Morpho 429/502/503/504; client adds at most one light retry when `retryable`.
- **Earned interest:** `/api/vault/v2/.../earned-interest` + `useVaultEarnedInterest` for all-time (shows **0** when never deposited). My Position header (left column, beside Your Position) shows total earned; past periods and future estimates live in the transact panel Past/Future toggle (`interest-utils.ts`). Use `resolveAssetDecimals` / `getAssetDecimalsForSymbol`.

## Transaction gotchas

- WETH deposits and withdraws are direct ERC-4626. There is no ETH selector and no unwrap (rebuilt and dropped in PR #120; see `CLAUDE.md` § WETH vaults for why smart wallets cannot receive WETH9 unwraps and how to pick the unwrap amount).
- Approval and main txs: `waitForSuccessfulReceipt` — a reverted receipt must not continue to the next step.
- Withdraws always simulate the plain exit first; the force planner reads instant liquidity on-chain and never force-deallocates the liquidity route market.
- Deposit caps: Vault V2 `maxDeposit` is always 0, so `deposit-capacity.ts` reads the liquidity adapter's market cap ids (adapter, collateral, market) against `firstTotalAssets`. Input caps at 99.9% of headroom (MAX, and on Deposit press); `depositToVaultV2` re-checks raw headroom before any approval (`DepositCapExceededError`). A failed read never blocks. See `CLAUDE.md` § Deposit caps.
- Force withdraw uses vault `multicall` (`forceDeallocate` + withdraw/redeem) on Blue markets. Do not use Vault V2 `maxWithdraw`. Do not add Bundler3.

## Known gotchas

- Morpho GraphQL invalid fields fail the whole request (HTTP 400).
- New vaults often have TVL before `avgNetApy` or position history is indexed. `stripIncompleteVaultHistoryBuckets` keeps TVL points; `finalizePositionHistory` seeds a short live-position line when history is empty. On an open position, only the current interval's zero buckets are dropped — earlier zeros stay so the portfolio chart does not forward-fill an old balance. Overview hides the APY chart until a positive rate exists.
- Morpho public API rate limit (429) / blips (502): `fetchMorphoGraphQL()` retries transient statuses. Positions route returns **503** + `retryable` for rate-limit/transient; other failures **502** without retryable spam.
- Morpho asset USD price: query `price { usd }`; parse via `resolveMorphoAssetPriceUsd()` in `api-utils.ts`.
- Token list = each registry vault's on-chain `asset()` (`lib/registry-assets.ts`); prices = Morpho by address (`/api/prices?addresses=`, `PriceContext`). No CoinGecko and no hardcoded token list: a vault in a new token needs only its registry row.
- Overlay scroll lock: use `useLockPageScroll()` — locks `body` and `[data-app-scroll]` in `AppLayout`. Reference counted, so nested overlays are safe; never set `overflow` directly.
- Layout uses `dvh`; do not style leftover AppKit dialog siblings (overlays look blank). Wallet connect uses Reown AppKit (`src/config/appkit.ts`) — do **not** enable SIWE/SIWX, email, socials, or `reownAuthentication` (those prompt a sign-message after connect).
- Turbopack chunk errors: `rm -rf .next .turbo && npm run dev`.

## Commands

```bash
npm run dev      # Turbopack dev server
npm run build    # Production build (local / Vercel)
npm run lint     # ESLint (local before push; GitHub CI)
npm test         # Vitest unit tests (src/**/*.test.ts)
```
