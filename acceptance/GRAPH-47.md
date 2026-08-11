# GRAPH-47 Windows payload and immutable candidate freeze

Date: 2026-08-11

## Release identity

- Public Integration Repository: `https://github.com/QinMian5/project-graph-plugins`
- Candidate branch: `candidate/v0.1.0`
- Integration Release: `0.1.1`
- Immutable candidate tag: `v0.1.1`
- Exact Project Graph source: `https://github.com/QinMian5/project-graph/tree/integration/v0.1.1-source`
- Project Graph source revision: `7d54c924cdda6bec5095b1a8206096ea9843442a`

The earlier `v0.1.0` tag remains at `9932184afcc206724c4bdb2321da908aaff8a490` and is not
moved or reused. It was rejected as a complete cross-platform candidate because that immutable
commit did not contain the Windows payload. `main` has not been advanced, so ordinary unpinned
Marketplace users do not follow either candidate.

## Target and payload record

| Target | Environment | Bundled Node | Ownership helper | Production process result |
| --- | --- | --- | --- | --- |
| `darwin-arm64` | macOS `26.5.2` (`25F84`), arm64 | `26.7.0`; official archive SHA-256 `7ee659a7768e641bbfd5360940660b8e8fd0052f77488f365562bac522fc15d4` | SHA-256 `e1c47324bbe801ee8b5b5164129d80343fd75a5f7ea7d47c56ffb165c1f2495d` | PASS |
| `win32-x64` | Microsoft Windows NT `10.0.26200.0`, OS/process architecture `x64`; PowerShell `5.1.26100.8972` | `26.7.0`; official archive SHA-256 `d3bd72755141ed32bbcd841228ee81897c8a98d50dfa7dae2179399a0a7c90f8` | release build, 270848 bytes; SHA-256 `aec1221c854091c9e785bffa7aec392b6ccc43c03913417df18a6aa8af4402ce` | PASS |

The Windows helper was built on the recorded target with Rust/Cargo `1.97.1`. The target-local
materializer downloaded and verified the official Node archive, materialized the production CLI and
native dependencies, flattened package-manager symlinks, and copied the verified helper and licenses.
The resulting Windows payload is 172 MiB and its x64 PE executables were copied back byte-for-byte.

Both Codex and Claude Code point to the same self-contained `plugins/project-graph` Host package.
That package contains both target payloads directly and has no package symlinks, sibling-package
dependency, submodule, Git LFS requirement, downloader, or installation-time build.

## Production process seam

The target-local Host adapter was invoked with a deliberately unusable runtime `PATH`; it resolved
only its package-local Node, CLI entry, and ownership helper.

macOS result:

```json
{"platform":"darwin","architecture":"arm64","version":"0.1.1","toolCount":29,"describedTool":"get_all_nodes","closedProjectObjectCount":201,"sourceUnchanged":true}
```

Windows result:

```json
{"platform":"win32","architecture":"x64","version":"0.1.1","toolCount":29,"describedTool":"get_all_nodes","closedProjectObjectCount":201,"sourceUnchanged":true}
```

The first Windows Closed Project run exposed that Rust canonicalization returns a `\\?\` verbatim
prefix while Node returns the ordinary drive path. The core process-contract test reproduced the
failure, and source revision `7d54c924cdda6bec5095b1a8206096ea9843442a` now normalizes only that
Windows prefix while preserving strict response-shape and ownership checks. The affected Windows
payload and Closed Project seam were then rematerialized and rerun successfully.

## Deterministic checks

- Shared Host package suite on macOS: 13 tests, 10 passed and 3 Windows-only tests skipped.
- Windows target package/adapter suite: 4 tests passed, including missing, mismatch, and unsupported
  target fail-closed cases.
- Project Graph full suite: 46 files / 307 tests passed; production CLI suite: 1 file / 4 tests passed.
- Project Graph TypeScript type-check: passed.
- Claude Code strict Marketplace and Plugin validation through `claudex`: passed on macOS and Windows.
- macOS bundled Node code-signature verification: passed.
- Release projection check, payload provenance/license checks, no-symlink checks, syntax checks, and
  `git diff --check`: passed.
- No Project Graph application or Tauri build command was run; only the required Windows ownership
  helper release build and target-local CLI materializers were run.

There is no blocking defect.
