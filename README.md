# Fintech DeFi vault project

Student repo for Morpho V2 vault front ends, plus folders for the bots and on-chain scripts that come later.

| Folder | What it is |
| --- | --- |
| `app` | Depositor front end. `npm install` then `npm run dev` (port 3000). |
| `curator` | Curator front end. `npm install` then `npm run dev` (port 3001). |
| `morpho-bots` | Placeholder for automation bots. Upstream: https://github.com/morpho-org/morpho-bots |
| `onchain` | Placeholder for on-chain scripts. |

Each front end has its own `package.json`. Install and run them separately.

Students change vault addresses, names, and types in two files, then deploy each front end on Vercel. See [USER-GUIDE.md](USER-GUIDE.md).

## Upstream sync

This repo is a copy of the template repo [Fintech-vault-project](https://github.com/Muscadine-Labs/Fintech-vault-project), and `app` and `curator` are copies of their own upstream repos, not exact mirrors. To pull in updates, ask your AI to follow [CLAUDE.md](CLAUDE.md).

| Folder | Upstream | Last synced commit |
| --- | --- | --- |
| `app` | [Muscadine-Labs/app](https://github.com/Muscadine-Labs/app) `main` | `b2ed404` (2026-11-15) |
| `curator` | [Muscadine-Labs/curator](https://github.com/Muscadine-Labs/curator) `main` | `99995fb` (2026-11-15) |
