# User guide

## 1. Add your vaults

List the same vault addresses in both files. Delete the example rows and add one row per vault. `type` is any group label, such as `Core`.

**App:** `app/src/lib/vaults.ts`, in `VAULTS`: `address`, `name` (shown until Morpho returns the vault's name), `symbol` (asset label, such as `USDC`), `vaultSymbol` (share token), `type`.

**Curator:** `curator/src/lib/config/vaults.ts`, in `vaultAddresses`: `address`, `name`, `assetSymbol`, `type`. For an asset other than USDC, USDT, DAI, WETH or a BTC token, also set `assetDecimals`.

Any token Morpho indexes works. A new vault appears once Morpho has indexed it, usually within minutes of its first transaction.

Vault writes in the curator are signed by the connected wallet. That wallet must hold the on-chain role for the action. There is no multisig Safe setup.

## 2. Make it yours

- App name: `APP_NAME` in `app/src/lib/constants.ts`
- Logo: `app/public/favicon.svg`, and `curator/public/favicon.svg` for the curator (see `curator/TODO.md` if you switch to a PNG)
- Contact, curator link and legal pages: the files in `app/src/components/legal/`

## 3. Run locally

Use Node.js 24. Create an [Alchemy](https://www.alchemy.com/) key for Base and a [Reown](https://dashboard.reown.com/) project ID.

```bash
cp app/.env.example app/.env.local
cp curator/.env.example curator/.env.local
```

Fill in the keys (see the tables below), then:

```bash
cd app && npm install && npm run dev
```

```bash
cd curator && npm install && npm run dev
```

The app runs at http://localhost:3000 and the curator at http://localhost:3001.

## 4. Deploy

Import this repo into [Vercel](https://vercel.com/) twice: one project with Root Directory `app`, one with `curator`. Add your domain under Settings → Domains, add the environment variables below, then redeploy.

**App**

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Your Alchemy key |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Your Reown project ID |
| `NEXT_PUBLIC_URL` | `https://app.yourdomain.com` (Vercel only) |

**Curator**

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Your Alchemy key |
| `ALCHEMY_API_KEY` | Server Alchemy key (can be the same; a separate one is safer) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Your Reown project ID |
| `NEXT_PUBLIC_APP_URL` | `https://curator.yourdomain.com` (Vercel only) |

Never commit `.env.local`.
