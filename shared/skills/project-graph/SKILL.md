---
name: project-graph
description: Use the bundled Project Graph CLI to discover or invoke built-in tools against an explicit .prg Project Path. Use when a user wants to inspect or change a Project Graph project, or inspect the CLI tool catalog and schemas.
---

# Use Project Graph

Resolve `../../bin/project-graph` relative to this `SKILL.md` on macOS, or
`../../bin/project-graph.cmd` on Windows, and run that adapter. The adapter selects the package-local
payload. Do not ask the user to install a CLI, Node.js, pnpm, or change `PATH`.

Before a project invocation, obtain an explicit `.prg` Project Path from the user or task context.
Treat the path as invocation input. Do not infer it from the foreground window, active tab, current
directory, recent files, or a previously used Project.

For each task:

1. Run `project-graph tool list` to discover the current tools.
2. Select the tool that fits the user's requested outcome, then run
   `project-graph tool describe <tool-name>` to obtain its current schema.
3. Construct every required field from that schema as one complete JSON object.
4. Invoke it with
   `project-graph tool invoke <tool-name> --project <project-path> --input '<complete-json-object>'`.
5. Interpret stdout, stderr, and exit code together. Stdout is the successful JSON value. A non-zero
   exit uses stderr for the structured error and leaves stdout empty.

The Agent owns tool choice, invocation order, and recovery from returned errors. This skill is a
capability guide, not an orchestrator, and it carries no copied tool catalog or schema.

Use the active Host's approval mechanism when an invocation can change data or has another material effect.
Make that judgment from the user's request and the discovered schema; the Plugin does not maintain a
parallel risk taxonomy.
