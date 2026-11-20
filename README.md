# OpenCode Cache Status

An OpenCode 2 terminal plugin that adds one item to the prompt footer: `Cache: 44%`.

It shows the latest completed model request with token usage in the current session, not a session-wide average. The percentage is `cache reads / (uncached input + cache reads + cache writes)`. Cache writes count as misses. If no usable usage is available, the plugin shows nothing.

The plugin reads only message types, completion markers, and token counters from OpenCode’s existing TUI state. It does not read prompt or tool content, access credentials, make network requests, or persist data.

## Install

On OpenCode 2.3.2 or later, install directly from the GitHub release. No clone or build is needed:

```sh
opencode plugin add 'github:white-hat/opencode-cache-status#v0.1.0'
```

OpenCode adds the package to `~/.config/opencode/cli.json` (or `$XDG_CONFIG_HOME/opencode/cli.json` if set). To uninstall it, remove that entry from the `plugins` array.

If you already installed from a local checkout, remove the old path from the same array before adding the new package. For local development, you can still add the checkout's absolute path instead of the package.

## Test

Run `bun test` to check the calculation with synthetic token counts. No credentials or OpenCode session data are needed.
