# GRAPH-45 macOS Codex tracer

Date: 2026-08-11

Candidate: `candidate/v0.1.0`

Candidate package revision: `9b8877d1d0abdd12d827e0b41b22e355b60d1192`

Integration Release: `0.1.0`

Project Graph revision: `5e924e48111e4f4cd3d38135053416befde70bf9`

Target: `darwin-arm64`

Bundled Node: `26.7.0`

The candidate was installed from the public
[`QinMian5/project-graph-plugins`](https://github.com/QinMian5/project-graph-plugins) repository at
`candidate/v0.1.0` through the Codex Marketplace lifecycle as `project-graph@project-graph`. The
tracer ran from the immutable installed Plugin root, not from the Project Graph workspace or the
Integration Repository payload source.

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

The Marketplace reported its Git source as
`https://github.com/QinMian5/project-graph-plugins.git`. The public repository's default `main`
branch remains at initialization commit `c2661a4493fbcf6b62a4c68a62a11f59a26c3eb0`; the Integration
Release has not been promoted.
