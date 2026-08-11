# Project Graph Plugins

Host-native plugin packages for the [Project Graph](https://github.com/QinMian5/project-graph) CLI.

Version `0.1.7` uses the standard host-runtime plugin model: the Plugin contains Project Graph CLI
templates, exact dependency lockfiles, and target-specific ownership helpers, but does not bundle
Node.js or `node_modules`. The immutable `v0.1.0` through `v0.1.6` tags remain unchanged.

## Runtime requirements

- Node.js 22.13 or newer and npm must be available on `PATH`.
- The first CLI invocation requires registry access so `npm ci` can install the locked production
  dependencies.
- Dependencies are installed under the Host's persistent Plugin data directory and reused on later
  invocations. Codex supplies `PLUGIN_DATA`; Claude Code supplies `CLAUDE_PLUGIN_DATA`.
- No global Project Graph CLI or pnpm installation is required.

## Candidate installation for Codex

Install the unpublished candidate from the public Integration Repository at its immutable tag:

```sh
codex plugin marketplace add QinMian5/project-graph-plugins --ref v0.1.7
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
claude plugin marketplace add QinMian5/project-graph-plugins@v0.1.7
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
Project Graph revision, host-runtime requirement, targets, and ownership-helper checksum. The
GRAPH-44 prerequisite must have produced the helper at the metadata-recorded source path (or pass
an equivalent verified artifact with `--ownership-helper`). From a sibling checkout of the exact
Project Graph revision:

```sh
pnpm sync-release
pnpm materialize:darwin-arm64 --project-graph ../project-graph
pnpm check:release
pnpm test
```

On the recorded Windows x64 target, build the ownership helper from the exact source revision, put
its SHA-256 into `release.json`, and materialize the target-local production dependencies:

```powershell
cargo build --release --bin project-graph-ownership-helper --manifest-path ..\project-graph\app\src-tauri\Cargo.toml
pnpm sync-release
pnpm materialize:win32-x64 --project-graph ..\project-graph
pnpm check:release
pnpm test
```

The resulting shared Host package is under `plugins/project-graph` and contains both
`darwin-arm64` and `win32-x64`. Each target payload contains a production CLI template, an exact npm
lockfile, the native ownership helper, and the Project Graph license. At runtime the adapter uses
the Host Node.js executable from `PATH`, installs locked production dependencies into persistent
Plugin data on first use, and executes the cached runtime. Neither Node.js nor `node_modules` is
committed to the Plugin package.

See [SOURCE.md](SOURCE.md) for provenance and corresponding source information.
