# CLAUDE.md

Student repo with copies of two upstream projects. This file tells an AI how to pull in upstream updates.

## Upstream repos and last synced commits

| Folder | Upstream | Branch | Last synced commit |
| --- | --- | --- | --- |
| `app` | https://github.com/Muscadine-Labs/app | `main` | `b2ed40480a39bab9dcf7ec1e679ffb3fa15eb4e4` (2026-11-15, PR #147) |
| `curator` | https://github.com/Muscadine-Labs/curator | `main` | `99995fb0767b05329b232e8c66300d5fb65a8180` (2026-11-15, PR #85) |

The README has the same table. Update both together.

## How to sync an upstream update

Do this for one folder at a time (`app` or `curator`).

1. Clone upstream outside this repo: `git clone https://github.com/Muscadine-Labs/<name> /tmp/upstream-<name>`. The clone needs enough history to reach the last synced commit.
2. List what is new: `git log --oneline <last-synced>..origin/main`.
3. Get the changes: `git diff <last-synced>..origin/main`. Skip upstream-only files that students do not have, such as `.github`, `.cursor`, `.mcp.json`, and the `app/api/auth`, `bots` and `gates` routes in `curator`.
4. Apply them to the matching folder here. This copy has student-specific edits, so merge by hand (`git apply --3way` helps) and never replace whole files or folders. Do not overwrite:
   - vault addresses, names and types (see `USER-GUIDE.md`)
   - `.env.example`, `README.md`, `CLAUDE.md`, `AGENTS.md`, `SECURITY.md`, `TODO.md` inside each folder
   - the student-only pages `app/src/app/contact` and `app/src/app/curator`
5. In the folder, run `npm install`, then `npm run build` (or `npm run lint`) to check it works.
6. Set "Last synced commit" in this file and in `README.md` to the new upstream `origin/main` SHA and date.
7. Commit with a message like `Sync app to upstream <short-sha>`.

If the last synced commit is not in the clone's history, deepen it with `git fetch --depth=1000 origin main`.
