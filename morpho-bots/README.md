# Morpho bots

This folder is reserved for vault automation bots. It is empty on purpose.

The upstream repo is [morpho-org/morpho-bots](https://github.com/morpho-org/morpho-bots). The curator front end links to it from the Curator tools page.

That repo includes several bots: liquidators, a Midnight market maker, a Vault V1 reallocator, and a Vault V2 reallocator. For these vaults you only need [vault-v2-reallocation](https://github.com/morpho-org/morpho-bots/tree/main/bots/vault-v2-reallocation). It ships with two very basic strategies:

- `equalize-utilizations` (the default) moves liquidity so each market's utilization moves toward the vault average.
- `apy-range` keeps each market's borrow APY inside a range you set.

Make your own strategy when those two do not match your goals and risk limits. If you build a bot, I can run it on my server. You add my wallet as an allocator on the vault.
