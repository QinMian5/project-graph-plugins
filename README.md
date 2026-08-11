# Project Graph Plugins

Host-native plugin packages for the [Project Graph](https://github.com/graphif/project-graph) CLI.

No Integration Release has been promoted to `main` yet. Version `0.1.0` is developed on
`candidate/v0.1.0`; ordinary unpinned Marketplace users must not follow it until the macOS and
Windows acceptance sequence is complete.

## Candidate installation for Codex

Install the unpublished candidate from the public Integration Repository at its immutable tag:

```sh
codex plugin marketplace add QinMian5/project-graph-plugins --ref v0.1.0
codex plugin add project-graph@project-graph
```

For local development, add this checkout through the same Marketplace lifecycle instead:

```sh
codex plugin marketplace add "$PWD"
codex plugin add project-graph@project-graph
```

The installed `project-graph` skill dynamically discovers tools and schemas before invoking the
package-local CLI. Every project invocation requires an explicit `.prg` Project Path.

Run the candidate tracer against the immutable installed Plugin root. It verifies dynamic
discovery, a Closed Project read, a write to a disposable copy, and the complete Open Project
desktop context matrix:

```sh
pnpm trace:codex \
  --plugin-root /absolute/installedPath/from-codex-plugin-add \
  --project-graph ../project-graph
```

## Candidate installation for Claude Code

Claude Code uses the same package root, release version, Shared Skill, adapter, and production
payload. Add the immutable candidate tag and install the Plugin with the default user scope:

```sh
claude plugin marketplace add QinMian5/project-graph-plugins@v0.1.0
claude plugin install project-graph@project-graph
```

For local development, replace the first command with:

```sh
claude plugin marketplace add "$PWD"
```

Run the same acceptance sequence against the installed Claude Code Plugin root:

```sh
pnpm trace:claude \
  --plugin-root /absolute/installedPath/from-claude-plugin-install \
  --project-graph ../project-graph
```

## Release materialization

`release.json` is the machine-readable authority for the Integration Release version, exact
Project Graph revision, targets, ownership-helper checksum, and bundled Node patch version. The
GRAPH-44 prerequisite must have produced the helper at the metadata-recorded source path (or pass
an equivalent verified artifact with `--ownership-helper`). From a sibling checkout of the exact
Project Graph revision:

```sh
pnpm sync-release
pnpm materialize:darwin-arm64 --project-graph ../project-graph
pnpm check:release
pnpm test
```

The resulting shared Host package is under `plugins/project-graph`. Runtime invocations use its bundled
Node, production CLI runtime, native ownership helper, and licenses; they do not use user Node,
pnpm, `PATH`, a desktop copy, or a downloader.

See [SOURCE.md](SOURCE.md) for provenance and corresponding source information.
