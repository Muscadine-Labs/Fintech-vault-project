# Curator

Next.js dashboard for Morpho V2 vaults. Vault addresses, names, and types live in `lib/config/vaults.ts`. See the repo `USER-GUIDE.md`.

## Quick Start (macOS)

Prerequisites: [Node.js](https://nodejs.org/) **24** and [Git](https://git-scm.com/). Check with:

```bash
node -v
npm -v
git --version
```

### 1. Open this folder

```bash
cd curator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file, then edit it with your keys:

```bash
cp .env.example .env.local
open -e .env.local
```

Fill in at minimum:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
ALCHEMY_API_KEY=your_alchemy_api_key
```

Get keys from [Reown Cloud](https://dashboard.reown.com/) (WalletConnect project ID) and [Alchemy](https://www.alchemy.com/).

### 4. Run the development server

```bash
npm run dev
```

### 5. Open the app

```bash
open http://localhost:3001
```

Or visit http://localhost:3001 in your browser.

## Environment Variables

Copy `.env.example` → `.env.local`. Summary:

| Variable | Required? | Notes |
|----------|-----------|-------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | **Yes in production** | Demo mode in local dev if unset |
| `ALCHEMY_API_KEY` | Recommended | Server RPC; public Base RPC if missing |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Recommended | Client RPC |
| `NEXT_PUBLIC_APP_URL` | No | If unset: `http://localhost:3001` locally, the Vercel production domain on Vercel |
| `NEXT_PUBLIC_SAFE_API_KEY` | Recommended | Safe Transaction Service history (free tier) |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linter

## Tech Stack

- Next.js 16.4 (App Router, webpack)
- TypeScript 6
- Tailwind CSS 4 + shadcn/ui
- Wagmi 2 + Reown AppKit (wallet)
- Viem (blockchain)
- TanStack Query (data fetching)
- Vitest 5

## License

Built on Base. The license is `LICENSE`.
