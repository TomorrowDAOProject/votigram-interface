import dayjs from "dayjs";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";


import { timeAgo, sleep } from "../time"; // Adjust path to your utility file

// Ensure real dayjs works in the component being tested
vi.mock("dayjs", async () => {
  const actualDayjs = (await vi.importActual("dayjs")) as typeof dayjs;
  return actualDayjs;
});

describe("timeAgo function", () => {
  it("returns correct relative time for past dates", () => {
    const mockDate = "2023-09-15T12:00:00.000Z";
    vi.setSystemTime(new Date(mockDate)); // Mock system time

    const inputDate = new Date("2023-09-10T12:00:00.000Z").getTime();
    const result = timeAgo(inputDate);

    expect(result).toBe("5 days ago");

    vi.useRealTimers(); // Restore real timers
  });

  it("returns correct relative time for future dates", () => {
    const mockDate = "2023-09-15T12:00:00.000Z";
    vi.setSystemTime(new Date(mockDate));

    const inputDate = new Date("2023-09-20T12:00:00.000Z").getTime();
    const result = timeAgo(inputDate);

    expect(result).toBe("in 5 days");

    vi.useRealTimers();
  });
});

describe("sleep function", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Mock timers
  });

  afterEach(() => {
    vi.useRealTimers(); // Restore real timers
  });

  it("resolves after the specified time", async () => {
    const promise = sleep(3000); // Call sleep for 3 seconds

    vi.advanceTimersByTime(3000); // Fast-forward 3 seconds

    await expect(promise).resolves.toBeUndefined();
  });
});
