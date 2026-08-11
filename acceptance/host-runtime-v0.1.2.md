# Host-runtime acceptance for v0.1.2

## Contract

- Integration Release: `0.1.2`
- Candidate tag: `v0.1.2`
- Exact Project Graph source revision: `7d54c924cdda6bec5095b1a8206096ea9843442a`
- Supported targets: `darwin-arm64`, `win32-x64`
- Host runtime: Node.js `>=26.0.0` with npm on `PATH`
- Dependency mode: locked `npm ci` into persistent Plugin data

Neither target payload contains a Node.js executable, a Node.js license copied from a bundled
runtime, or `node_modules`. Each contains the target CLI template, `package.json`,
`package-lock.json`, the verified ownership helper, Project Graph's GPL license, version, and
provenance metadata.

## macOS arm64

The adapter fixture verified first-use installation into isolated Plugin data, marker creation, and
cache reuse. The production payload then passed Closed Project acceptance:

```json
{"platform":"darwin","architecture":"arm64","version":"0.1.2","toolCount":29,"describedTool":"get_all_nodes","closedProjectObjectCount":201,"sourceUnchanged":true}
```

## Windows x64

The payload was materialized on Windows 10 `10.0.26200.8973` with host Node.js `26.7.0`, npm
`11.11.1`, and pnpm `11.3.0`. The Windows-only adapter tests verified first-use installation, cache
reuse, missing-Node failure, and missing-bootstrap failure. The production payload then passed
Closed Project acceptance:

```json
{"platform":"win32","architecture":"x64","version":"0.1.2","toolCount":29,"describedTool":"get_all_nodes","closedProjectObjectCount":201,"sourceUnchanged":true}
```

No Plugin installation was repeated during this acceptance run. Windows work used disposable source
checkouts and the already-installed runtime toolchain.
