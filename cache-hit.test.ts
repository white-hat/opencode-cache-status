import { describe, expect, test } from "bun:test"
import { cacheHitLabel } from "./cache-hit"

const assistant = (input: number, read: number, write: number) => ({
  type: "assistant",
  time: { completed: 1 },
  tokens: { input, cache: { read, write } },
})

describe("cacheHitLabel", () => {
  test("reports the share of input tokens read from cache, counting writes as misses", () => {
    expect(cacheHitLabel([assistant(100, 600, 300)])).toBe("Cache: 60%")
  })

  test("displays a whole percentage rounded to the nearest integer", () => {
    expect(cacheHitLabel([assistant(560, 439, 1)])).toBe("Cache: 44%")
  })

  test("uses the newest completed request, not the session total", () => {
    expect(cacheHitLabel([
      assistant(0, 1_000, 0),
      { type: "user" },
      assistant(750, 250, 0),
      { type: "assistant" },
      { ...assistant(0, 900, 0), time: {} },
      assistant(0, 0, 0),
    ])).toBe("Cache: 25%")
  })

  test("distinguishes a real zero hit rate from missing usage", () => {
    expect(cacheHitLabel([assistant(0, 0, 1_000)])).toBe("Cache: 0%")
    expect(cacheHitLabel([assistant(0, 1_000, 0)])).toBe("Cache: 100%")
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
    ])).toBe("Cache: 50%")
  })
})
