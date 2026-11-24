# Vaults

Depositor app for Morpho V2 vaults. Dashboard, vault explorer, and deposit/withdraw.

**Registry:** `src/lib/vaults.ts`. Change addresses, names, and types there. See the repo `USER-GUIDE.md`.  
**Dev:** `npm run dev` → http://localhost:3000  
**Docs:** `CLAUDE.md` (architecture — vault registry, deposit gate, force withdraw), `AGENTS.md` (agent rules), `TODO.md` (task list).

**Product notes:** Base-only v2 vaults. External Morpho positions can appear in portfolio lists but only **whitelisted** registry vaults have detail pages.

## Getting Started

Install dependencies:

```bash
npm install
```

Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## Security

**Reporting Security Vulnerabilities**

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Report security concerns to your instructor. See `SECURITY.md`.
3. Include details about the vulnerability, steps to reproduce, and potential impact

We will acknowledge receipt within 48 hours and provide an assessment within 7 days.

**Security Best Practices**

- Never commit API keys or secrets to the repository
- Use environment variables for all sensitive configuration
- Keep dependencies up to date
- Review and audit smart contract interactions before executing transactions
- Verify transaction details before signing

## Environment Variables

Copy `.env.example` → `.env.local`.

| Variable | Required? | Purpose |
|----------|-----------|---------|
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | **Yes** | Base RPC |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | **Yes** | Reown AppKit / WalletConnect |
| `NEXT_PUBLIC_URL` | No | If unset: `http://localhost:3000` locally, the Vercel production domain on Vercel |

**Wallets:** Reown AppKit with injected (EIP-6963) wallets, WalletConnect, Coinbase Wallet and Base Account (smart wallet) through the app's own lazy connectors (`src/lib/lazy-connectors.ts`; Base Account telemetry off). Plain web app: no Base App / mini-app integration.

Run `npm run lint` and `npm run build` locally before you push. Production `npm run build` also runs on Vercel with the env vars set there.

## Deployment checklist

1. **Vercel** — set `NEXT_PUBLIC_ALCHEMY_API_KEY`, `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, and `NEXT_PUBLIC_URL` to this deployment's URL.
2. **Verify** — the Vaults title loads, connect wallet works, chart Y-axes show readable ticks (zoomed to data range, not 8-decimal tails).
