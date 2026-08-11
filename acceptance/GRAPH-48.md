# GRAPH-48 pinned macOS Marketplace acceptance

Date: 2026-08-11

## Release under test

- Public Integration Repository: `https://github.com/QinMian5/project-graph-plugins`
- Immutable ref: `v0.1.0`
- Tag commit: `9932184afcc206724c4bdb2321da908aaff8a490`
- Integration Release: `0.1.0`
- Bundled Project Graph source revision: `5e924e48111e4f4cd3d38135053416befde70bf9`
- Acceptance harness revision: `a926ba167387d394759bbcc68fcfa5340fc9a5f2`
- Platform: macOS `26.5.2` (`25F84`), `arm64`

Both Hosts started without an active `project-graph` installation or Marketplace. Their hosted
Marketplace checkouts resolved `v0.1.0` to the same tag commit above.

## Host acceptance table

| Host | Host version | Standard hosted flow | Immutable Plugin root | Manifest / CLI version | Functional result | Desktop context | Result | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Codex | `codex-cli 0.147.0` | `codex plugin marketplace add QinMian5/project-graph-plugins --ref v0.1.0`; `codex plugin add project-graph@project-graph` | `/Users/mianqin/.codex/plugins/cache/project-graph/project-graph/0.1.0` | `0.1.0` / `0.1.0` | `tool list`: 29; described `get_all_nodes`; Closed Project read: 201 objects and source unchanged; disposable-copy write: 0 objects and only the copy changed; Open Project read matrix: 29 tools | active tab, tab list, window focus, and DOM focus unchanged | PASS | Plugin loaded and enabled from the user installation cache; adapter and bundled Node resolve inside this root. |
| Claude Code | `2.1.226` | `claudex plugin marketplace add QinMian5/project-graph-plugins@v0.1.0`; `claudex plugin install project-graph@project-graph` | `/Users/mianqin/.claude/plugins/cache/project-graph/project-graph/0.1.0` | `0.1.0` / `0.1.0` | `tool list`: 29; described `get_all_nodes`; Closed Project read: 201 objects and source unchanged; disposable-copy write: 0 objects and only the copy changed; Open Project read matrix: 29 tools | active tab, tab list, window focus, and DOM focus unchanged | PASS | Plugin loaded and enabled at the CLI default `user` scope; adapter and bundled Node resolve inside this root. |

The installed adapter and bundled Node files are byte-identical across the two Host roots. Neither
flow required an additional Project Graph CLI, Node installation, or `PATH` change.

## Shared tracer result

Each installed root produced the same result:

```json
{"version":"0.1.0","toolCount":29,"describedTool":"get_all_nodes","closedProject":{"sourceObjectCount":201,"sourceHash":"011174b2de97eabfcb3cdedba1449681d14c60cae7b399f3189ee2e602331e68","sourceUnchanged":true,"disposableObjectCount":0,"disposableChanged":true},"openProject":{"tools":29,"categories":{"project":19,"selection":6,"viewport":4},"desktopContext":"unchanged"}}
```

## Notes

- The first desktop acceptance runs exposed a harness-only macOS focus race: the off-screen Tauri
  window used the default initially focused configuration. The acceptance harness now creates that
  still-focusable window with `focus: false`, explicitly focuses it immediately before the context
  snapshot, and fails unless focus was established. The after-snapshot therefore verifies the same
  real window remains focused while the active-tab, tab-list, and DOM-focus assertions remain intact.
- The fix changes only the development acceptance window configuration. The immutable Plugin payload
  and its recorded Project Graph source revision are unchanged.
- There is no blocking defect.

## Validation and cleanup

- Integration release projection check: passed
- Integration package tests: 9 passed
- Project Graph TypeScript type-check: passed
- Project Graph tests: 46 files / 306 tests passed; production CLI tests: 1 file / 4 tests passed
- Claude Code strict installed-Plugin validation: passed
- Build commands were not run.
- Both test Plugins and Marketplaces were removed after acceptance. Pre-existing Codex installations
  and `superpowers@claude-plugins-official` were left unchanged.
