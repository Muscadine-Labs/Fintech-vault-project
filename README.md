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

## Upstream sync status

`app` and `curator` are copies of the Muscadine Labs repos, adjusted for students. When upstream changes, you can pull the updates in with AI (see below). Keep this table current after every sync.

| Folder | Upstream repo | Branch | Last synced commit | Commit date |
| --- | --- | --- | --- | --- |
| `app` | https://github.com/Muscadine-Labs/app | `main` | [`b2ed404`](https://github.com/Muscadine-Labs/app/commit/b2ed40480a39bab9dcf7ec1e679ffb3fa15eb4e4) (PR #147) | 2026-11-15 |
| `curator` | https://github.com/Muscadine-Labs/curator | `main` | [`99995fb`](https://github.com/Muscadine-Labs/curator/commit/99995fb0767b05329b232e8c66300d5fb65a8180) (PR #85) | 2026-11-15 |

Our copies are not exact mirrors. Student-specific changes (vault config, removed pages and API routes, docs) differ from upstream, so never overwrite a folder wholesale.

### Fetch updates with AI

Paste this into Claude Code (or any AI coding tool) from the repo root:

```text
Read CLAUDE.md in this repo. Update the app and curator folders from their upstream
repos, starting after the "Last synced commit" in the README table. Keep our
student changes, and update the table when done.
```

Manual version, for `app` (use `curator` the same way):

```bash
git clone https://github.com/Muscadine-Labs/app /tmp/upstream-app
cd /tmp/upstream-app
git log --oneline b2ed40480a39bab9dcf7ec1e679ffb3fa15eb4e4..main   # what is new
git diff b2ed40480a39bab9dcf7ec1e679ffb3fa15eb4e4..main            # the changes
```
