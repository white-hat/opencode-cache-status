type Message = {
  readonly type: string
  readonly time?: { readonly completed?: unknown }
  readonly tokens?: {
    readonly input: number
    readonly cache: { readonly read: number; readonly write: number }
  }
}

export function cacheHitLabel(messages: readonly Message[] | undefined): string | undefined {
  if (!messages) return
  // The TUI's cached transcript is ordered oldest to newest.
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message?.type !== "assistant" || message.time?.completed == null || !message.tokens) continue
    const { input, cache: { read, write } } = message.tokens
    if (![input, read, write].every((n) => Number.isFinite(n) && n >= 0)) continue
    const total = input + read + write
    if (total > 0 && Number.isFinite(total)) return `Cache hit ${(read / total * 100).toFixed(1)}%`
  }
}
