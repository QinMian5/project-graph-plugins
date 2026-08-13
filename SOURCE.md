# Source and license provenance

This repository and the Project Graph Plugin package are distributed under GPL-3.0-only. The full
license text is included at the repository root and inside the Plugin package.

`release.json` identifies the exact Project Graph source revision used to materialize each
production CLI runtime. Candidate `0.1.9` is materialized from the exact local revision recorded
there. The materializer refuses a different revision or a dirty Project Graph worktree.

The target metadata also pins the ownership helper by SHA-256 and records its path in the exact
Project Graph checkout. Materialization refuses a helper whose bytes do not match that Release
record, preventing an unverified pre-existing build artifact from being attributed to the source
revision.

Node.js is not redistributed by this repository or the Plugin. `release.json` records the supported
Host Node.js range. The adapter uses the Node.js and npm executables already available on the Host's
`PATH`.

Materialization converts the production dependency declaration into a target-specific npm
`package-lock.json`. On first use, the Plugin copies the CLI template into the Host's persistent
Plugin data directory and runs the recorded `npm ci` command there. The installed `node_modules`
directory is runtime data and is never part of the Plugin package or Git history.

Payload-local `provenance.json` records the Integration Release, target, Project Graph source,
host-runtime contract, ownership helper, and dependency installation command. Reproduce it with the
materialization commands in the README from the exact source revision on the recorded target OS.
