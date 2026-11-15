# Curator TODO

Do these in order. The example vaults, favicon, and empty API keys are only there so the dashboard runs. Replace them with yours.

## 1. Your vaults

Edit `lib/config/vaults.ts`. For each vault you want in the sidebar, set:

- `address` — your vault contract
- `name` — fallback until Morpho returns the on-chain name
- `assetSymbol` — the vault's asset symbol. Any token is fine.
- `type` — any group label you want, such as `Core`

You do not need Prime or Frontier. Delete example rows you are not using, and add a row for each vault you are. Use the same addresses, names, and types in `app/src/lib/vaults.ts`. Details are in the repo `USER-GUIDE.md`.

## 2. Your Safes

Edit `lib/safe/config.ts`. Replace each placeholder address with your own Safe on Base. `/safe` lists those four addresses.

## 3. Favicon

Replace `public/favicon.svg` with your own icon. An AI-generated SVG or PNG is fine. If you use a PNG, point `app/layout.tsx`, `lib/wallet/config.ts`, and `public/manifest.json` at that file.

## 4. API keys

Create an [Alchemy](https://www.alchemy.com/) key for Base, and a [Reown / WalletConnect](https://dashboard.reown.com/) project ID.

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_ALCHEMY_API_KEY`
- `ALCHEMY_API_KEY` (the same Alchemy key; the server uses this one)
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

Do not commit `.env.local`.

## 5. Vercel

Follow **Deploy** in the repo `USER-GUIDE.md`. Create a Vercel account, import this GitHub repo with Root Directory `curator`, add the environment variables, and connect your domain. Set `NEXT_PUBLIC_APP_URL` to that domain, then redeploy.
