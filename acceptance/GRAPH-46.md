# GRAPH-46 macOS Claude Code acceptance

Date: 2026-08-11

## Candidate under test

- Public Integration Repository: `https://github.com/QinMian5/project-graph-plugins`
- Candidate ref: `candidate/v0.1.0`
- Traced package revision: `bc2fc84aa84d904161aeaf1e50a71094f1670151`
- Integration Release: `0.1.0`
- Project Graph source: `https://github.com/graphif/project-graph`
- Project Graph revision: `5e924e48111e4f4cd3d38135053416befde70bf9`
- Host: macOS arm64
- Claude Code: `2.1.226`

## Host package contract

- Claude Code Marketplace ID: `project-graph`
- Claude Code Plugin ID: `project-graph`
- Display name: `Project Graph`
- Marketplace source: `./plugins/project-graph`
- Installed scope: `user` through the CLI default; no `--scope` override was supplied.
- Claude Code and Codex resolve the same self-contained package root, so they use the same adapter,
  `release-version`, canonical Shared Skill projection, and `darwin-arm64` production payload.
- The shared adapter contains only target selection, package-local payload validation, release-version
  validation, and argument forwarding. Package-boundary tests exclude hooks, MCP, orchestration,
  persistent state, and copied Project Graph tool definitions.

## Hosted Marketplace flow

The public candidate was added and installed through Claude Code using the user-provided `claudex`
wrapper:

```sh
zsh -ic 'claudex plugin marketplace add QinMian5/project-graph-plugins@candidate/v0.1.0'
zsh -ic 'claudex plugin install project-graph@project-graph'
```

Claude Code reported:

- Marketplace source `QinMian5/project-graph-plugins`, ref `candidate/v0.1.0`
- Marketplace checkout revision `bc2fc84aa84d904161aeaf1e50a71094f1670151`
- Plugin version `0.1.0`, enabled at user scope
- Installed root `/Users/mianqin/.claude/plugins/cache/project-graph/project-graph/0.1.0`

The installed root passed Claude Code strict validation. The shared Host tracer then ran against
that installed root:

```sh
pnpm trace:claude \
  --plugin-root /Users/mianqin/.claude/plugins/cache/project-graph/project-graph/0.1.0 \
  --project-graph /Volumes/WD-Black-4TB/Code/project-graph
```

Result:

```json
{"version":"0.1.0","toolCount":29,"describedTool":"get_all_nodes","closedProject":{"sourceObjectCount":201,"sourceHash":"011174b2de97eabfcb3cdedba1449681d14c60cae7b399f3189ee2e602331e68","sourceUnchanged":true,"disposableObjectCount":0,"disposableChanged":true},"openProject":{"tools":29,"categories":{"project":19,"selection":6,"viewport":4},"desktopContext":"unchanged"}}
```

This covers version, dynamic discovery and description, Closed Project read immutability,
disposable-copy write isolation, Open Project discovery, and the desktop context invariant.

## Validation and cleanup

- Claude Code strict marketplace validation: passed
- Claude Code strict local and installed Plugin validation: passed
- Integration release projection check: passed
- Targeted release, Shared Skill, package boundary, adapter, and payload tests: passed
- Project Graph TypeScript type-check: passed
- Standards review: 0 remaining findings
- Spec review: 0 findings
- Build commands were not run.
- The test Plugin and Marketplace were removed from user scope after acceptance. The pre-existing
  `superpowers@claude-plugins-official` installation was left unchanged.
