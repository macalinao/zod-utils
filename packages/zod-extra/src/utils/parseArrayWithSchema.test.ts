import { describe, expect, it } from "vitest";
import { z } from "zod";

import { parseArrayWithSchema } from "./parseArrayWithSchema.js";

describe("parseArrayWithSchema", () => {
  it("should parse an array of valid items according to the schema", () => {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
    });

    const input = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];

    const result = parseArrayWithSchema(schema, input);

    expect(result).toEqual(input); // Assuming the function returns the input if valid
  });

  it("should throw an error for an array with invalid items", () => {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
    });

    const input = [
      { id: 1, name: "Alice" },
      { id: "two", name: "Bob" }, // Invalid id
    ];

    expect(() => parseArrayWithSchema(schema, input)).toThrow();
  });

  it("should handle an empty array", () => {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
    });

    const input: unknown[] = [];

    const result = parseArrayWithSchema(schema, input);

    expect(result).toEqual(input); // Assuming the function returns the input if valid
  });

  // Add more test cases as needed based on the function's expected behavior
});
