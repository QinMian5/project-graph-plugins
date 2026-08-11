# Source and license provenance

This repository and the Project Graph Plugin package are distributed under GPL-3.0-only. The full
license text is included at the repository root and inside the Plugin package.

`release.json` identifies the exact Project Graph source revision used to materialize each bundled
production CLI runtime. Its source repository is <https://github.com/graphif/project-graph>. The
materializer refuses a different revision or a dirty Project Graph worktree.

The bundled Node runtime comes from the official archive URL and SHA-256 recorded in `release.json`.
To keep the executable below the Git repository single-file limit, the materializer retains only
symbols needed at runtime with `strip -u -r`, then applies an ad-hoc macOS signature required to run
the modified arm64 Mach-O. The original Node license and third-party notices are included with the
payload.

Payload-local `provenance.json` records the Integration Release, target, Project Graph source, Node
source archive, checksum, and transformations. Reproduce it with the materialization commands in
the README from the exact source revision and target OS.
