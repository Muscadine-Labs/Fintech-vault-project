# App TODO

Do these in order. The example vaults, favicon, and empty API keys are only there so the app runs. Replace them with yours.

## 1. Your vaults

Edit `src/lib/vaults.ts`. For each vault you want in the app, set:

- `address` — your vault contract
- `name` — fallback until Morpho returns the on-chain name
- `type` — any group label you want, such as `Core`

You do not need Prime or Frontier. Delete example rows you are not using, and add a row for each vault you are. Use the same addresses, names, and types in `curator/src/lib/config/vaults.ts`. Details are in the repo `USER-GUIDE.md`.

## 2. Favicon

Replace `public/favicon.svg` with your own icon. An AI-generated SVG or PNG is fine. If you use a PNG, point `src/app/layout.tsx` and `src/config/wagmi.ts` at that file.

## 3. Legal and contact pages

Read `src/components/legal/` (Terms, Legal, Privacy, Risk) and change anything that does not match how you run your vaults. Put your email on the Contact page (`ContactPage.tsx`).

## 4. API keys

Create an [Alchemy](https://www.alchemy.com/) key for Base, and a [Reown / WalletConnect](https://dashboard.reown.com/) project ID.

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_ALCHEMY_API_KEY`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

Do not commit `.env.local`.

## 5. Vercel

Follow **Deploy** in the repo `USER-GUIDE.md`. Create a Vercel account, import this GitHub repo with Root Directory `app`, add the environment variables, and connect your domain. Set `NEXT_PUBLIC_URL` to that domain, then redeploy.
