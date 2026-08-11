# Project Graph Plugins

Host-native plugin packages for the [Project Graph](https://github.com/graphif/project-graph) CLI.

No Integration Release has been promoted to `main` yet. Version `0.1.0` is developed on
`candidate/v0.1.0`; ordinary unpinned Marketplace users must not follow it until the macOS and
Windows acceptance sequence is complete.

## Candidate installation for Codex

From the repository-hosted candidate ref:

```sh
codex plugin marketplace add graphif/project-graph-plugins --ref candidate/v0.1.0
codex plugin add project-graph@project-graph
```

For local candidate development, replace the repository identity with this checkout path. The
Plugin is then installed and managed entirely by the normal Codex lifecycle.

The installed `project-graph` skill dynamically discovers tools and schemas before invoking the
package-local CLI. Every project invocation requires an explicit `.prg` Project Path.

## Release materialization

`release.json` is the machine-readable authority for the Integration Release version, exact
Project Graph revision, targets, and bundled Node patch version. From a sibling checkout of the
exact Project Graph revision:

```sh
pnpm sync-release
pnpm materialize:darwin-arm64
pnpm check:release
pnpm test
```

The resulting Codex package is under `plugins/project-graph`. Runtime invocations use its bundled
Node, production CLI runtime, native ownership helper, and licenses; they do not use user Node,
pnpm, `PATH`, a desktop copy, or a downloader.

See [SOURCE.md](SOURCE.md) for provenance and corresponding source information.
