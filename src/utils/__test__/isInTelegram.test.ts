import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { isInTelegram } from "../isInTelegram"; // Adjust the import path as needed

describe("isInTelegram", () => {
  let originalWindow: typeof global.window;

  beforeEach(() => {
    originalWindow = global.window;
    vi.restoreAllMocks(); // Restore the environment before each test
  });

  afterEach(() => {
    global.window = originalWindow;
    vi.restoreAllMocks();
  });

  it("returns true if running in Telegram WebApp", () => {
    // Mock the `window` object
    global.window = {
      Telegram: {
        WebApp: {
          initData: "mock-init-data", // Simulate presence of initData
        },
      },
    } as unknown as Window & typeof globalThis;

    const result = isInTelegram();
    expect(result).toBe(true);
  });

  it("returns false if Telegram WebApp is not initialized", () => {
    // Mock the `window` object without `initData`
    global.window = {
      Telegram: {
        WebApp: {}, // No initData
      },
    } as unknown as Window & typeof globalThis;

    const result = isInTelegram();
    expect(result).toBe(false);
  });

  it("returns false if Telegram is not defined", () => {
    // Mock the `window` object without `Telegram`
    global.window = {} as unknown as Window & typeof globalThis;

    const result = isInTelegram();
    expect(result).toBe(false);
  });

  it("returns false if window is undefined (e.g., Node.js environment)", () => {
    global.window = undefined as unknown as Window & typeof globalThis;

    const result = isInTelegram();
    expect(result).toBe(false);

    // Restore the original `window` object
    global.window = originalWindow;
  });
});
