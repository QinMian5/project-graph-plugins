# GRAPH-50 Integration Release promotion acceptance

Date: 2026-08-12

## Release identity

- Public Integration Repository: `https://github.com/QinMian5/project-graph-plugins`
- Candidate branch: `candidate/v0.1.9`
- Immutable release tag: `v0.1.9`
- Integration Release: `0.1.9`
- Exact Project Graph source: `https://github.com/QinMian5/project-graph/tree/integration/v0.1.9-source`
- Project Graph source revision: `e51a3c96850eca587f0f15da84e7392334f46b21`

The tag and `main` must resolve to the commit containing this table. The release tag is created once
after every candidate check passes and is never moved or reused. Promotion then fast-forwards
`main` to that exact tag commit.

## macOS Host acceptance

Environment: macOS `26.5.2` (`25F84`) arm64, Codex `0.147.0`, Claude Code `2.1.226`.

| Host | Standard candidate lifecycle | Installed root | Functional result | Desktop context | Result |
| --- | --- | --- | --- | --- | --- |
| Codex | Local Marketplace add and Plugin add | `/Users/mianqin/.codex/plugins/cache/project-graph/project-graph/0.1.9` | `--version`: `0.1.9`; 29 tools; described `get_all_nodes`; Closed Project: 201 objects and source unchanged; disposable copy changed to 0 objects; Open Project categories `19/6/4` | Active tab, tab list, window focus, and DOM focus unchanged | PASS |
| Claude Code | Local Marketplace add and Plugin install at user scope | `/Users/mianqin/.claude/plugins/cache/project-graph/project-graph/0.1.9` | `--version`: `0.1.9`; 29 tools; described `get_all_nodes`; Closed Project: 201 objects and source unchanged; disposable copy changed to 0 objects; Open Project categories `19/6/4` | Active tab, tab list, window focus, and DOM focus unchanged | PASS |

Both installed roots reported the same source fixture SHA-256,
`011174b2de97eabfcb3cdedba1449681d14c60cae7b399f3189ee2e602331e68`.
The Codex tracer was repeated after one transient external-volume Rust archive `SIGBUS`; the repeat
completed without changing source or Plugin content. Claude Code's official Plugin validator also
passed.

## Windows Host acceptance

Environment: Windows 11 Education x64 on the designated acceptance machine.

| Host packages | Integration Release | Project Graph source | Result | Notes |
| --- | --- | --- | --- | --- |
| Codex and Claude Code | `0.1.9` | `e51a3c96850eca587f0f15da84e7392334f46b21` | PASS | The release owner confirmed that the exact `0.1.9` candidate had already completed the required Windows acceptance for both Host packages. No rerun was required for promotion. |

The Windows machine was offline during this promotion task. Its availability was therefore not
treated as a release blocker after the existing `0.1.9` acceptance was explicitly confirmed.

## Deterministic release checks

- Integration release projection check: passed.
- Integration package tests: 17 total; 12 passed and 5 Windows-only tests skipped on macOS.
- Codex Plugin validator: passed.
- Claude Code Plugin validator: passed.
- Both ownership-helper SHA-256 values match `release.json` and payload provenance.
- `release.json`, both Host manifests, both payloads, this table, the GPL-3.0-only license, and
  source provenance identify Integration Release `0.1.9` and Project Graph revision
  `e51a3c96850eca587f0f15da84e7392334f46b21`.
- No updater, release channel, latest alias, hot switch, parallel lifecycle, or managed Marketplace
  submission was added.
