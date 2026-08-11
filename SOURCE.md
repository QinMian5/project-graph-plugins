# Source and license provenance

This repository and the Project Graph Plugin package are distributed under GPL-3.0-only. The full
license text is included at the repository root and inside the Plugin package.

`release.json` identifies the exact Project Graph source revision used to materialize each bundled
production CLI runtime. The corresponding source is published at
<https://github.com/QinMian5/project-graph/tree/integration/v0.1.1-source>. The materializer refuses a
different revision or a dirty Project Graph worktree.

The target metadata also pins the ownership helper by SHA-256 and records its path in the exact
Project Graph checkout. Materialization refuses a helper whose bytes do not match that Release
record, preventing an unverified pre-existing build artifact from being attributed to the source
revision.

The bundled Node runtime comes from the official target archive URL and SHA-256 recorded in
`release.json`. To keep the macOS executable below the Git repository single-file limit, the
materializer retains only symbols needed at runtime with `strip -u -r`, then applies an ad-hoc macOS
signature required to run the modified arm64 Mach-O. The Windows executable is retained byte-for-byte
from the verified official archive. The original Node license and third-party notices are included
with each payload.

The production dependencies are flattened during materialization because Codex Marketplace
installation does not preserve pnpm's package symlinks.

Payload-local `provenance.json` records the Integration Release, target, Project Graph source, Node
source archive, checksum, and target-specific transformations. Reproduce it with the materialization
commands in the README from the exact source revision on the recorded target OS.
