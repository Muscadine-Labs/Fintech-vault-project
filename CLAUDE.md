# CLAUDE.md

Student repo with copies of two upstream projects. This file tells an AI how to pull in upstream updates.

## Upstream repos and last synced commits

| Folder | Upstream | Branch | Last synced commit |
| --- | --- | --- | --- |
| `app` | https://github.com/Muscadine-Labs/app | `main` | `b2ed40480a39bab9dcf7ec1e679ffb3fa15eb4e4` (2026-11-15, PR #147) |
| `curator` | https://github.com/Muscadine-Labs/curator | `main` | `99995fb0767b05329b232e8c66300d5fb65a8180` (2026-11-15, PR #85) |

The README has the same table. Update both together.

## How to sync an upstream update

For each folder (`app`, `curator`):

1. Clone upstream outside this repo and run `git log <last-synced>..origin/main` and `git diff <last-synced>..origin/main`. If the commit is missing, run `git fetch --depth=1000 origin main`.
2. Apply the changes by hand to the matching folder. Don't overwrite whole files, vault config (see `USER-GUIDE.md`), each folder's docs and `.env.example`, `app/src/app/contact`, or `app/src/app/curator`. Skip upstream-only files such as `.github`, `.cursor`, `.mcp.json`, and curator's `api/auth`, `bots` and `gates`.
3. Run `npm install` and `npm run build` in the folder.
4. Update the SHA and date here and in `README.md`, then commit.
