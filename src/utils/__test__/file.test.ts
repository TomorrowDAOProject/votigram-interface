import { describe, it, expect, vi } from "vitest";

import { generateRandomString, blobToFile } from "../file"; // Update the import path as necessary

describe("generateRandomString", () => {
  it("generates a string of the default length (10)", () => {
    const randomString = generateRandomString();
    expect(randomString).toHaveLength(10);
  });

  it("generates a string of the specified length", () => {
    const length = 15;
    const randomString = generateRandomString(length);
    expect(randomString).toHaveLength(length);
  });

  it("generates a string containing only valid characters", () => {
    const randomString = generateRandomString(50);
    const validCharacters = /^[A-Za-z0-9]+$/; // Matches only alphanumeric characters
    expect(randomString).toMatch(validCharacters);
  });
});

describe("blobToFile", () => {
  it("creates a File from a Blob with a randomly generated name", () => {
    const blob = new Blob(["Test content"], { type: "text/plain" });

    // Mock `generateRandomString`
    vi.spyOn(global.Math, "random").mockReturnValue(0.5); // Ensure consistent random string
    const file = blobToFile(blob);

    expect(file).toBeInstanceOf(File);
    expect(file.name).toMatch(/^[A-Za-z0-9]{10}\.png$/); // Matches the random file name with `.png`
    expect(file.type).toBe(blob.type);
    expect(file.size).toBe(blob.size);

    vi.restoreAllMocks(); // Restore the original implementation
  });

  it("creates a File from a Blob with a specified name", () => {
    const blob = new Blob(["Test content"], { type: "text/plain" });
    const fileName = "test-file.txt";
    const file = blobToFile(blob, fileName);

    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe(fileName);
    expect(file.type).toBe(blob.type);
    expect(file.size).toBe(blob.size);
  });

  it("correctly sets the lastModified property to the current timestamp", () => {
    const blob = new Blob(["Test content"], { type: "text/plain" });
    const timestamp = Date.now();

    // Mock `Date.now` to return a consistent value
    vi.spyOn(global.Date, "now").mockReturnValue(timestamp);

    const file = blobToFile(blob);

    expect(file.lastModified).toBe(timestamp);

    vi.restoreAllMocks(); // Restore the original implementation
  });
});
