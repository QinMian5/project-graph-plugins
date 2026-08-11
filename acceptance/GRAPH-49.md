# GRAPH-49 host-runtime compatibility and Windows console acceptance

Date: 2026-08-11

## Release identity

- Public Integration Repository: `https://github.com/QinMian5/project-graph-plugins`
- Candidate branch: `candidate/v0.1.8`
- Immutable candidate tag: `v0.1.8`
- Tag commit: `8f1a389a1df54b384586cb18ce4ad11edeb30220`
- Integration Release: `0.1.8`
- Exact Project Graph source: `https://github.com/QinMian5/project-graph/tree/integration/v0.1.8-source`
- Project Graph source revision: `7a1cebb09ea9c9736f79e3b236e1c1a6c2eaba8f`

The Plugin is published from the personal public repositories above, not from a `graphif`
Marketplace repository. Codex and Claude Code both installed the immutable `v0.1.8` ref through
their standard Marketplace flows. The resulting hosted Marketplace checkout resolved to the tag
commit above.

## Host runtime contract

The Plugin does not bundle a Node executable or `node_modules`. It requires host Node.js
`>=22.13.0`, then installs its pinned production dependencies once into persistent Plugin data.
No system Node installation or upgrade was performed during acceptance.

| Runtime | Source | Result |
| --- | --- | --- |
| Node.js `22.23.2` | Official portable Windows x64 archive in the temporary acceptance directory | PASS |
| Node.js `24.14.0` | Existing Windows host runtime | PASS |

Both payload package manifests, lockfile roots, provenance records, launchers, bootstrap checks,
skills, documentation, and release metadata state the same `>=22.13.0` contract. Beyond the
required production Host adapters, the package has no additional task-specific GUI, VBS,
PowerShell, or command wrapper. A temporary hidden VBS acceptance launcher was used only to
distinguish the scheduled-task console from production Plugin processes; it is not present in the
repository, tag, or installed Plugin.

## Windows host acceptance

Environment: Windows 11 Education x64 (`10.0.26200.0`), PowerShell `5.1`, Codex `0.147.0`,
Claude Code `2.1.227` invoked through `claudex`.

| Host | Runtime | Remote-installed Closed Project flow | Exact-candidate Open Project fixture | Result |
| --- | --- | --- | --- | --- |
| Codex | Node.js `22.23.2` | 29 tools; described `get_all_nodes`; 201 source objects; source unchanged; disposable copy changed to 0 objects | 29 tools: 19 project, 6 selection, 4 viewport; desktop context unchanged | PASS |
| Codex | Node.js `24.14.0` | Same result | 29 tools: 19 project, 6 selection, 4 viewport; desktop context unchanged | PASS |
| Claude Code | Node.js `22.23.2` | 29 tools; described `get_all_nodes`; 201 source objects; source unchanged; disposable copy changed to 0 objects | 29 tools: 19 project, 6 selection, 4 viewport; desktop context unchanged | PASS |
| Claude Code | Node.js `24.14.0` | Same result | 29 tools: 19 project, 6 selection, 4 viewport; desktop context unchanged | PASS |

The installed Codex and Claude Code roots both reported version `0.1.8`. Their Closed Project
matrix was rerun after removing the earlier candidate installations and installing `v0.1.8` from
the public remote tag.

The Open Project matrix was run from the byte-identical exact-candidate package root rather than
rerun from the hosted installation caches. It uses an off-screen Vite/Tauri desktop acceptance
fixture. Its application and development-process windows belong to that fixture, not to the
installed Plugin adapter, so it is functional acceptance evidence rather than console-visibility
evidence.

## Console visibility evidence

Windows process sampling covered 165 production Plugin processes across Node.js 22 and 24, Codex
and Claude Code, and Closed and Open operations. All 165 production processes had
`MainWindowHandle = 0`: 162 adapter command processes and 3 ownership-helper processes. The only
visible handles observed during the broader desktop run belonged to the Vite/Tauri acceptance
fixture and its Project Graph acceptance application.

The final visual check ran the real remote-installed Closed Plugin path from the interactive
Windows desktop with only the temporary scheduled-task launcher hidden. The user observed no
flash. A subsequent interactive-session screenshot after stopping the Open fixture showed a clean
desktop, and the exact acceptance-process scan reported zero remaining processes.

## Candidate lineage

The following immutable tags remain unmoved and rejected as final GRAPH-49 candidates:

- `v0.1.3`: ownership compatibility and runtime publication issues.
- `v0.1.4`: incomplete atomic runtime installation and Windows live-bridge behavior.
- `v0.1.5`: bridge response and Windows path mismatch.
- `v0.1.6`: functional path/runtime result, but visible Windows console behavior.
- `v0.1.7`: hid the outer adapter command while additional Windows acceptance process seams
  remained visible.

`v0.1.8` adds `windowsHide` only at the remaining exact Windows child-process seams: the two
ownership-helper invocations, the Closed Project worker, the managed Vite/Tauri acceptance
processes, and the Plugin bootstrap install process. It does not add a new abstraction or product
wrapper.

## Cross-platform validation

- macOS Host tracer: Codex and Claude Code passed with 29 tools; Closed Project source unchanged;
  disposable copy changed; Open Project categories `19/6/4`; desktop context unchanged.
- Project Graph TypeScript type-check: passed.
- Project Graph full suite: 46 files / 307 tests passed; production CLI suite: 1 file / 4 tests
  passed.
- Windows targeted Rust bridge and ownership tests: passed.
- Integration release projection check: passed.
- Integration package tests: 12 passed; 5 Windows-only tests skipped on macOS.
- Official Claude Code Plugin validation: passed using the existing PyYAML-capable validator
  environment; all Claude Code host commands were invoked through `claudex`.
- Both ownership-helper SHA-256 values match `release.json` and committed payload provenance.
- No Git symlinks, Git LFS payloads, bundled Node executable, or bundled `node_modules` are present.
- Build commands were not run.

There is no blocking defect.
