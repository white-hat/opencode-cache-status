import { describe, expect, test } from "bun:test"
import { cacheHitLabel } from "./cache-hit"

const assistant = (input: number, read: number, write: number) => ({
  type: "assistant",
  time: { completed: 1 },
  tokens: { input, cache: { read, write } },
})

describe("cacheHitLabel", () => {
  test("reports the share of input tokens read from cache, counting writes as misses", () => {
    expect(cacheHitLabel([assistant(100, 600, 300)])).toBe("Cache hit 60.0%")
  })

  test("uses the newest completed request, not the session total", () => {
    expect(cacheHitLabel([
      assistant(0, 1_000, 0),
      { type: "user" },
      assistant(750, 250, 0),
      { type: "assistant" },
      { ...assistant(0, 900, 0), time: {} },
      assistant(0, 0, 0),
    ])).toBe("Cache hit 25.0%")
  })

  test("distinguishes a real zero hit rate from missing usage", () => {
    expect(cacheHitLabel([assistant(0, 0, 1_000)])).toBe("Cache hit 0.0%")
    expect(cacheHitLabel([assistant(0, 1_000, 0)])).toBe("Cache hit 100.0%")
    expect(cacheHitLabel([assistant(0, 0, 0)])).toBeUndefined()
    expect(cacheHitLabel(undefined)).toBeUndefined()
  })

  test("ignores user messages and unusable counters", () => {
    expect(cacheHitLabel([
      assistant(50, 50, 0),
      assistant(-1, 100, 0),
      assistant(0, Infinity, 0),
      assistant(0, NaN, 0),
      { type: "user", tokens: { input: 0, cache: { read: 10, write: 0 } } },
    ])).toBe("Cache hit 50.0%")
  })
})
