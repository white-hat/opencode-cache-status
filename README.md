# OpenCode Cache Status

A local OpenCode 2 terminal plugin that adds one item to the prompt footer: `Cache: 44%`.

It shows the latest completed model request with token usage in the current session, not a session-wide average. The percentage is `cache reads / (uncached input + cache reads + cache writes)`. Cache writes count as misses. If no usable usage is available, the plugin shows nothing.

The plugin reads only message types, completion markers, and token counters from OpenCode’s existing TUI state. It does not read prompt or tool content, access credentials, make network requests, or persist data.

## Install

Clone this repository, then add its absolute path to the `plugins` array in `~/.config/opencode/cli.json` (or `$XDG_CONFIG_HOME/opencode/cli.json` if set). Keep your existing settings and plugin entries.

```json
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "plugins": ["/absolute/path/to/opencode-cache-status"]
}
```

No npm install or build is needed. To remove the plugin, remove its entry from `cli.json`.

## Test

Run `bun test` to check the calculation with synthetic token counts. No credentials or OpenCode session data are needed.
