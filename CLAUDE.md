# CLAUDE.md

Student repo with copies of two upstream projects (`app` and `curator`). It is also a copy of the template repo https://github.com/Muscadine-Labs/Fintech-vault-project, which is upstream for the whole repo. This file tells an AI how to pull in upstream updates.

## What's in this repo

Two independent Next.js + TypeScript apps for curated Morpho V2 vaults on Base (chain id 8453). They have no shared code and no root `package.json`. Run `npm install`, `npm run dev`, `npm run lint` and `npm run build` inside each folder. Use Node.js 26.

| Folder | What it is | Port | Own docs |
| --- | --- | --- | --- |
| `app` | Depositor front end: deposit, withdraw, portfolio, vault analytics. Source in `src/`. | 3000 | `CLAUDE.md`, `AGENTS.md`, `TODO.md`, `SECURITY.md` |
| `curator` | Curator dashboard: TVL and fee charts, risk, governance, caps, allocation. Source in `src/app/`, `src/components/`, `src/lib/`. | 3001 | `CLAUDE.md`, `AGENTS.md`, `TODO.md`, `SECURITY.md`, `docs/` |
| `morpho-bots` | Empty placeholder; its README links to the upstream bots. | | `README.md` |
| `onchain` | Empty placeholder for future Morpho scripts. | | `README.md` |

Read the folder's own `CLAUDE.md` before changing code there. It holds the architecture, Morpho integration notes and conventions. `AGENTS.md` has the short rules, and `curator/CLAUDE.md` covers the V2 vault mechanics and reallocation rules.

## Things to know

- **Student setup:** vault addresses go in `app/src/lib/vaults.ts` and `curator/src/lib/config/vaults.ts`, and the two lists must match. Curator writes are signed by the connected wallet that holds the on-chain role. Branding is `APP_NAME` in `app/src/lib/constants.ts`. `USER-GUIDE.md` covers setup, env vars and Vercel deploys.
- **Node version:** Node 26, same as upstream (`engines.node` `26.x`, `@types/node` 26.x).
- **Env vars:** copy each `.env.example` to `.env.local`. The app needs an Alchemy key and a Reown (WalletConnect) project ID. Never commit keys.
- **Vercel:** deploy as two projects, with Root Directory `app` and `curator`.
- **Data:** vault data comes from the public Morpho GraphQL API (`https://api.morpho.org/graphql`). Only Morpho V2 vaults are supported.
- **Before finishing a change:** run `npm run lint` and `npm run build` in each folder you touched. The build needs the keys in `.env.local` (see Env vars).
- **Upstream rules vs. this repo:** the subfolder docs came from the upstream repos. They say to read `TODO.md` first, keep `CLAUDE.md` and `AGENTS.md` in sync, and never push to `main`. In this student repo, follow the user's own git instructions. Each folder's `TODO.md` is the student setup checklist (vaults, favicon, keys, Vercel), not upstream's task list, so don't sync it.
- **Removed on purpose:** students don't get the upstream's business-specific parts, so the student copies are trimmed. Missing items include curator auth, bots and gates routes, the real vault addresses, and protocol stats and business info. Multisig Safes and the Safe Transaction Service were removed from `curator` as well (`lib/safe/`, `/safe`, `NEXT_PUBLIC_SAFE_API_KEY`). The subfolder docs still describe some older pieces. Treat a missing file as intentional, check that a file exists before relying on it, and never re-add removed pieces, including when syncing from upstream.

## Upstream repos and last synced commits

There are three upstreams. The template repo https://github.com/Muscadine-Labs/Fintech-vault-project is upstream for this whole repo (root docs, `USER-GUIDE.md`, placeholders, structure). `app` and `curator` each also have their own upstream, listed below.

| Folder | Upstream | Branch | Last synced commit |
| --- | --- | --- | --- |
| root files | https://github.com/Muscadine-Labs/Fintech-vault-project | `main` | none recorded yet. On the first sync, compare the root files against the template's current `main`, then record its SHA and date here. |
| `app` | https://github.com/Muscadine-Labs/app | `main` | `12b522ca9f443a2156ff4759cd9d9c01749b7ad3` (2026-11-24, PR #151) |
| `curator` | https://github.com/Muscadine-Labs/curator | `main` | `83829a6b80cf95ca98ce2a24d76f500940601fe3` (2026-11-24, PR #90) |

The README has the same table. Update both together.

## How to sync an upstream update

For the root files, sync from the template repo the same way, using the `root files` row of the table above as `<last-synced>` (compare against it, apply by hand, keep student setup). For each folder (`app`, `curator`):

1. Clone upstream outside this repo and run `git log <last-synced>..origin/main` and `git diff <last-synced>..origin/main`. If the commit is missing, run `git fetch --depth=1000 origin main`.
2. Apply the changes by hand to the matching folder. Don't overwrite whole files, vault config (see `USER-GUIDE.md`), each folder's docs and `.env.example`, `app/src/app/contact`, or `app/src/app/curator`. Skip anything removed on purpose (see "Removed on purpose"), plus `.github`, which students don't have.
3. In the folder, make sure `.env.local` exists (`cp .env.example .env.local`) with the Alchemy key and Reown project ID filled in. `app` throws at build time without them. Then run `npm install` and `npm run build`. If you have no keys, check with `npm run lint` and say the build was skipped.
4. Update the SHA and date here and in `README.md`, then commit.
