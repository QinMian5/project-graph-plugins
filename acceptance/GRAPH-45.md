# GRAPH-45 macOS Codex tracer

Date: 2026-08-11

Candidate: `candidate/v0.1.0`

Integration Release: `0.1.0`

Project Graph revision: `5e924e48111e4f4cd3d38135053416befde70bf9`

Target: `darwin-arm64`

Bundled Node: `26.7.0`

The candidate was installed through the local Codex Marketplace lifecycle as
`project-graph@project-graph`. The tracer ran from the immutable installed Plugin root, not from
the Project Graph workspace or the Integration Repository payload source.

```json
{
  "version": "0.1.0",
  "toolCount": 29,
  "describedTool": "get_all_nodes",
  "closedProject": {
    "sourceObjectCount": 201,
    "sourceHash": "011174b2de97eabfcb3cdedba1449681d14c60cae7b399f3189ee2e602331e68",
    "sourceUnchanged": true,
    "disposableObjectCount": 0,
    "disposableChanged": true
  },
  "openProject": {
    "tools": 29,
    "categories": {
      "project": 19,
      "selection": 6,
      "viewport": 4
    },
    "desktopContext": "unchanged"
  }
}
```

The public GitHub candidate-ref step remains blocked: the authenticated GitHub account receives
`HTTP 403: You need admin access to the organization before adding a repository to it.` when
creating `graphif/project-graph-plugins`. `main` remains at the repository initialization commit;
the Integration Release has not been promoted.
