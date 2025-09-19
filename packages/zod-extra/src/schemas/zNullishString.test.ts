import { describe, expect, test } from "bun:test";
import * as z from "zod";
import { zNonEmptyString } from "./zNonEmptyString.js";
import { zNullishString } from "./zNullishString.js";

describe("zNullishString", () => {
  describe("with zNonEmptyString (primary use case)", () => {
    test("transforms empty string to null", () => {
      const schema = zNullishString(zNonEmptyString);
      expect(schema.parse("")).toBeNull();
    });

    test("transforms whitespace-only string to null", () => {
      const schema = zNullishString(zNonEmptyString);
      expect(schema.parse("   ")).toBeNull();
      expect(schema.parse("\t")).toBeNull();
      expect(schema.parse("\n")).toBeNull();
      expect(schema.parse("  \t \n  ")).toBeNull();
    });

    test("preserves null values", () => {
      const schema = zNullishString(zNonEmptyString);
      expect(schema.parse(null)).toBeNull();
    });

    test("transforms undefined to null", () => {
      const schema = zNullishString(zNonEmptyString);
      expect(schema.parse(undefined)).toBeNull();
    });

    test("preserves and trims non-empty strings", () => {
      const schema = zNullishString(zNonEmptyString);
      expect(schema.parse("hello")).toBe("hello");
      expect(schema.parse("hello world")).toBe("hello world");
      expect(schema.parse("  hello  ")).toBe("hello");
      expect(schema.parse("\thello\t")).toBe("hello");
    });

    test("works with max length", () => {
      const schema = zNullishString(zNonEmptyString.max(10));

      expect(schema.parse("")).toBeNull();
      expect(schema.parse(null)).toBeNull();
      expect(schema.parse(undefined)).toBeNull();
      expect(schema.parse("short")).toBe("short");
      expect(schema.parse("exactly10!")).toBe("exactly10!");

      expect(() => schema.parse("this is too long")).toThrow();
    });

    test("works with min and max length", () => {
      const schema = zNullishString(zNonEmptyString.min(3).max(10));

      expect(schema.parse("")).toBeNull();
      expect(schema.parse(null)).toBeNull();
      expect(schema.parse(undefined)).toBeNull();
      expect(schema.parse("abc")).toBe("abc");
      expect(schema.parse("exactly10!")).toBe("exactly10!");

      expect(() => schema.parse("ab")).toThrow();
      expect(() => schema.parse("this is way too long")).toThrow();
    });

    test("works with custom error message", () => {
      const schema = zNullishString(zNonEmptyString.min(1, "Custom error"));

      expect(schema.parse("")).toBeNull();
      expect(schema.parse("valid")).toBe("valid");
    });
  });

  describe("with email validation", () => {
    test("transforms empty/null/undefined to null, validates non-empty", () => {
      const schema = zNullishString(z.string().trim().min(1).pipe(z.email()));

      expect(schema.parse("")).toBeNull();
      expect(schema.parse("   ")).toBeNull();
      expect(schema.parse(null)).toBeNull();
      expect(schema.parse(undefined)).toBeNull();
      expect(schema.parse("test@example.com")).toBe("test@example.com");
      expect(schema.parse("  test@example.com  ")).toBe("test@example.com");
      expect(schema.parse("\ttest@example.com\t")).toBe("test@example.com");
      expect(schema.parse("\ntest@example.com\n")).toBe("test@example.com");

      expect(() => schema.parse("invalid-email")).toThrow();
    });
  });

  describe("with URL validation", () => {
    test("transforms empty/null/undefined to null, validates non-empty", () => {
      const schema = zNullishString(z.string().trim().min(1).pipe(z.url()));

      expect(schema.parse("")).toBeNull();
      expect(schema.parse(null)).toBeNull();
      expect(schema.parse(undefined)).toBeNull();
      expect(schema.parse("https://example.com")).toBe("https://example.com");
      expect(schema.parse("  https://example.com  ")).toBe(
        "https://example.com",
      );
      expect(schema.parse("\thttps://example.com\t")).toBe(
        "https://example.com",
      );
      expect(schema.parse("\nhttps://example.com\n")).toBe(
        "https://example.com",
      );

      expect(() => schema.parse("not-a-url")).toThrow();
    });
  });

  describe("with regex validation", () => {
    test("transforms empty/null/undefined to null, validates non-empty", () => {
      const schema = zNullishString(
        z
          .string()
          .trim()
          .min(1)
          .regex(/^[A-Z]+$/),
      );

      expect(schema.parse("")).toBeNull();
      expect(schema.parse(null)).toBeNull();
      expect(schema.parse(undefined)).toBeNull();
      expect(schema.parse("ABC")).toBe("ABC");
      expect(schema.parse("XYZ")).toBe("XYZ");

      expect(() => schema.parse("abc")).toThrow();
      expect(() => schema.parse("123")).toThrow();
    });
  });

  describe("with string transforms on non-empty strings", () => {
    test("works with uppercase transform", () => {
      const schema = zNullishString(
        z
          .string()
          .trim()
          .min(1)
          .transform((val) => val.toUpperCase()),
      );

      expect(schema.parse("")).toBeNull();
      expect(schema.parse(null)).toBeNull();
      expect(schema.parse(undefined)).toBeNull();
      expect(schema.parse("hello")).toBe("HELLO");
      expect(schema.parse("world")).toBe("WORLD");
    });

    test("works with chained transforms", () => {
      const schema = zNullishString(
        z
          .string()
          .trim()
          .min(1)
          .toLowerCase()
          .transform((val) => `prefix_${val}`),
      );

      expect(schema.parse("")).toBeNull();
      expect(schema.parse(null)).toBeNull();
      expect(schema.parse(undefined)).toBeNull();
      expect(schema.parse("  HELLO  ")).toBe("prefix_hello");
      expect(schema.parse("WORLD")).toBe("prefix_world");
    });

    test("transforms to different type", () => {
      const schema = zNullishString(
        z
          .string()
          .trim()
          .min(1)
          .transform((val) => val.length),
      );

      expect(schema.parse("")).toBeNull();
      expect(schema.parse(null)).toBeNull();
      expect(schema.parse(undefined)).toBeNull();
      expect(schema.parse("hello")).toBe(5);
      expect(schema.parse("hi")).toBe(2);
    });
  });

  describe("with refinements", () => {
    test("works with custom refinements on non-empty strings", () => {
      const schema = zNullishString(
        z
          .string()
          .trim()
          .min(1)
          .refine((val) => val.includes("@"), {
            message: "Must contain @",
          }),
      );

      expect(schema.parse("")).toBeNull();
      expect(schema.parse(null)).toBeNull();
      expect(schema.parse(undefined)).toBeNull();
      expect(schema.parse("user@domain")).toBe("user@domain");
      expect(schema.parse("  user@domain  ")).toBe("user@domain");
      expect(schema.parse("\tuser@domain\t")).toBe("user@domain");
      expect(schema.parse("\nuser@domain\n")).toBe("user@domain");

      expect(() => schema.parse("no-at-sign")).toThrow("Must contain @");
    });

    test("works with multiple refinements", () => {
      const schema = zNullishString(
        z
          .string()
          .trim()
          .min(1)
          .refine((val) => val.length >= 5, "Too short")
          .refine((val) => val.includes("-"), "Must contain hyphen"),
      );

      expect(schema.parse("")).toBeNull();
      expect(schema.parse(null)).toBeNull();
      expect(schema.parse(undefined)).toBeNull();
      expect(schema.parse("hello-world")).toBe("hello-world");

      expect(() => schema.parse("test")).toThrow("Too short");
      expect(() => schema.parse("hello")).toThrow("Must contain hyphen");
    });
  });

  describe("safeParse behavior", () => {
    test("safeParse returns success with null for empty values", () => {
      const schema = zNullishString(zNonEmptyString);

      expect(schema.safeParse("")).toEqual({ success: true, data: null });
      expect(schema.safeParse("   ")).toEqual({ success: true, data: null });
      expect(schema.safeParse(null)).toEqual({ success: true, data: null });
      expect(schema.safeParse(undefined)).toEqual({
        success: true,
        data: null,
      });
    });

    test("safeParse returns success with value for valid strings", () => {
      const schema = zNullishString(zNonEmptyString.min(3));

      expect(schema.safeParse("hello")).toEqual({
        success: true,
        data: "hello",
      });
      expect(schema.safeParse("abc")).toEqual({ success: true, data: "abc" });
    });

    test("safeParse returns error for invalid strings", () => {
      const schema = zNullishString(z.string().trim().min(1).pipe(z.email()));

      const result = schema.safeParse("not-an-email");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
      }
    });

    test("safeParse with max length constraint", () => {
      const schema = zNullishString(zNonEmptyString.max(80));

      expect(schema.safeParse("")).toEqual({ success: true, data: null });
      expect(schema.safeParse(null)).toEqual({ success: true, data: null });
      expect(schema.safeParse(" this is my string ")).toEqual({
        success: true,
        data: "this is my string",
      });

      const longString = "a".repeat(100);
      const result = schema.safeParse(longString);
      expect(result.success).toBe(false);
    });
  });

  describe("type inference", () => {
    test("correctly infers output type with string", () => {
      const schema = zNullishString(zNonEmptyString);
      type Output = z.infer<typeof schema>;

      const testOutput: Output = schema.parse(null);
      const testOutput2: Output = schema.parse("string");

      expect(testOutput).toBeNull();
      expect(testOutput2).toBe("string");
    });

    test("correctly infers output type with transforms", () => {
      const schema = zNullishString(
        z
          .string()
          .trim()
          .min(1)
          .transform((val) => val.length),
      );
      type Output = z.infer<typeof schema>;

      const value: Output = schema.parse("hello");
      expect(value).toBe(5);

      const nullValue: Output = schema.parse("");
      expect(nullValue).toBeNull();
    });

    test("works with complex transforms", () => {
      const schema = zNullishString(
        z
          .string()
          .trim()
          .min(1)
          .transform((val) => ({
            original: val,
            length: val.length,
            uppercase: val.toUpperCase(),
          })),
      );

      const result = schema.parse("hello");
      expect(result).toEqual({
        original: "hello",
        length: 5,
        uppercase: "HELLO",
      });

      expect(schema.parse("")).toBeNull();
    });
  });

  describe("edge cases", () => {
    test("handles very long strings", () => {
      const longString = "a".repeat(10000);
      const schema = zNullishString(zNonEmptyString);

      expect(schema.parse(longString)).toBe(longString);
    });

    test("handles special characters", () => {
      const schema = zNullishString(zNonEmptyString);

      expect(schema.parse("😀🎉")).toBe("😀🎉");
      expect(schema.parse("こんにちは")).toBe("こんにちは");
      expect(schema.parse("¡Hola!")).toBe("¡Hola!");
    });

    test("handles strings with only special whitespace characters", () => {
      const schema = zNullishString(zNonEmptyString);

      expect(schema.parse("\u00A0")).toBeNull();
      expect(schema.parse("\u2003")).toBeNull();
      // Zero-width space is not removed by trim(), so it's treated as a valid character
      expect(schema.parse("\u200B")).toBe("\u200B");
    });

    test("handles zero-width characters", () => {
      const schema = zNullishString(zNonEmptyString);

      // Zero-width characters behavior varies - some are treated as whitespace, some aren't
      expect(schema.parse("\u200B\u200C\u200D")).toBe("\u200B\u200C\u200D");
      // BOM (Byte Order Mark) is treated as whitespace by trim()
      expect(schema.parse("\uFEFF")).toBeNull();
    });
  });

  describe("real-world usage patterns", () => {
    test("form field validation", () => {
      const userSchema = z.object({
        name: zNullishString(zNonEmptyString),
        bio: zNullishString(zNonEmptyString.max(100)),
        website: zNullishString(z.string().trim().min(1).pipe(z.url())),
      });

      const result = userSchema.parse({
        name: "John",
        bio: "",
        website: undefined,
      });

      expect(result).toEqual({
        name: "John",
        bio: null,
        website: null,
      });
    });

    test("optional profile fields", () => {
      const profileSchema = z.object({
        username: zNonEmptyString,
        displayName: zNullishString(zNonEmptyString),
        bio: zNullishString(zNonEmptyString.max(500)),
        location: zNullishString(zNonEmptyString),
        website: zNullishString(z.string().trim().min(1).pipe(z.url())),
      });

      const result = profileSchema.parse({
        username: "johndoe",
        displayName: "   ",
        bio: "",
        location: null,
        website: "https://example.com",
      });

      expect(result).toEqual({
        username: "johndoe",
        displayName: null,
        bio: null,
        location: null,
        website: "https://example.com",
      });
    });

    test("API request validation", () => {
      const updateSchema = z.object({
        id: z.string().pipe(z.uuid()),
        title: zNullishString(zNonEmptyString.max(100)),
        description: zNullishString(zNonEmptyString.max(1000)),
        tags: z.array(zNonEmptyString).optional(),
      });

      const result = updateSchema.parse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "New Title",
        description: "   ",
        tags: ["tag1", "tag2"],
      });

      expect(result).toEqual({
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "New Title",
        description: null,
        tags: ["tag1", "tag2"],
      });
    });

    test("database model with nullable fields", () => {
      const articleSchema = z.object({
        id: z.number(),
        title: zNonEmptyString,
        subtitle: zNullishString(zNonEmptyString),
        content: zNonEmptyString,
        publishedAt: z.date().nullable(),
        metadata: z.object({
          author: zNullishString(zNonEmptyString),
          tags: z.array(zNonEmptyString).default([]),
        }),
      });

      const result = articleSchema.parse({
        id: 1,
        title: "Main Title",
        subtitle: "",
        content: "Article content here",
        publishedAt: null,
        metadata: {
          author: undefined,
          tags: ["tech", "news"],
        },
      });

      expect(result).toEqual({
        id: 1,
        title: "Main Title",
        subtitle: null,
        content: "Article content here",
        publishedAt: null,
        metadata: {
          author: null,
          tags: ["tech", "news"],
        },
      });
    });
  });

  describe("array usage", () => {
    test("works in array schemas with mixed values", () => {
      const schema = z.array(zNullishString(zNonEmptyString));

      const result = schema.parse([
        "hello",
        "",
        null,
        undefined,
        "world",
        "   ",
      ]);
      expect(result).toEqual(["hello", null, null, null, "world", null]);
    });

    test("filters and transforms array elements", () => {
      const schema = z.array(
        zNullishString(zNonEmptyString.transform((s) => s.toUpperCase())),
      );

      const result = schema.parse(["hello", "", "world", null]);
      expect(result).toEqual(["HELLO", null, "WORLD", null]);
    });
  });

  describe("optional and nullable combinations", () => {
    test("works with optional modifier", () => {
      const schema = z.object({
        field: zNullishString(zNonEmptyString).optional(),
      });

      // Optional with zNullishString always processes undefined to null
      expect(schema.parse({})).toEqual({ field: null });
      expect(schema.parse({ field: "" })).toEqual({ field: null });
      expect(schema.parse({ field: "value" })).toEqual({ field: "value" });
      expect(schema.parse({ field: undefined })).toEqual({ field: null });
    });

    test("works with nullable modifier", () => {
      const schema = z.object({
        field: zNullishString(zNonEmptyString).nullable(),
      });

      expect(schema.parse({ field: null })).toEqual({ field: null });
      expect(schema.parse({ field: "" })).toEqual({ field: null });
      expect(schema.parse({ field: "value" })).toEqual({ field: "value" });
    });

    test("works with default values", () => {
      const schema = z.object({
        field: zNullishString(zNonEmptyString).default("default"),
      });

      expect(schema.parse({})).toEqual({ field: "default" });
      expect(schema.parse({ field: "" })).toEqual({ field: null });
      expect(schema.parse({ field: "value" })).toEqual({ field: "value" });
    });

    test("works with catch values", () => {
      const schema = zNullishString(zNonEmptyString).catch("fallback");

      expect(schema.parse("valid")).toBe("valid");
      expect(schema.parse("")).toBeNull();
      expect(schema.parse(null)).toBeNull();
    });
  });

  describe("error messages", () => {
    test("preserves inner schema error messages", () => {
      const schema = zNullishString(
        zNonEmptyString.min(5, "String must be at least 5 characters"),
      );

      try {
        schema.parse("abc");
        expect(true).toBe(false);
      } catch (error) {
        const zodError = error as z.ZodError;
        expect(zodError.message).toContain(
          "String must be at least 5 characters",
        );
      }
    });

    test("preserves email validation error", () => {
      const schema = zNullishString(
        z.string().trim().min(1).pipe(z.email("Invalid email format")),
      );

      try {
        schema.parse("not-email");
        expect(true).toBe(false);
      } catch (error) {
        const zodError = error as z.ZodError;
        expect(zodError.message).toContain("Invalid email format");
      }
    });

    test("handles custom error messages in refinements", () => {
      const schema = zNullishString(
        zNonEmptyString.refine(
          (val) => val.startsWith("prefix_"),
          "Value must start with 'prefix_'",
        ),
      );

      try {
        schema.parse("invalid");
        expect(true).toBe(false);
      } catch (error) {
        const zodError = error as z.ZodError;
        expect(zodError.message).toContain("Value must start with 'prefix_'");
      }
    });
  });

  describe("performance", () => {
    test("handles large number of validations efficiently", () => {
      const schema = zNullishString(zNonEmptyString);
      const iterations = 10000;

      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        schema.parse("");
        schema.parse(null);
        schema.parse("test");
      }
      const end = performance.now();

      expect(end - start).toBeLessThan(1000);
    });

    test("handles complex nested structures efficiently", () => {
      const schema = z.object({
        a: zNullishString(zNonEmptyString),
        b: z.object({
          c: zNullishString(zNonEmptyString.max(100)),
          d: z.array(zNullishString(zNonEmptyString)),
        }),
      });

      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        schema.parse({
          a: "",
          b: {
            c: "test",
            d: ["", "value", null, undefined],
          },
        });
      }
      const end = performance.now();

      expect(end - start).toBeLessThan(500);
    });
  });

  describe("composition patterns", () => {
    test("can be nested in complex schemas", () => {
      const addressSchema = z.object({
        street1: zNonEmptyString,
        street2: zNullishString(zNonEmptyString),
        city: zNonEmptyString,
        state: zNonEmptyString,
        zip: zNullishString(
          z
            .string()
            .trim()
            .min(1)
            .regex(/^\d{5}(-\d{4})?$/),
        ),
      });

      const result = addressSchema.parse({
        street1: "123 Main St",
        street2: "",
        city: "Springfield",
        state: "IL",
        zip: "62701",
      });

      expect(result).toEqual({
        street1: "123 Main St",
        street2: null,
        city: "Springfield",
        state: "IL",
        zip: "62701",
      });
    });

    test("works with union types", () => {
      const schema = z.union([zNullishString(zNonEmptyString), z.number()]);

      expect(schema.parse("")).toBeNull();
      expect(schema.parse("hello")).toBe("hello");
      expect(schema.parse(42)).toBe(42);
    });

    test("works with discriminated unions", () => {
      const schema = z.discriminatedUnion("type", [
        z.object({
          type: z.literal("text"),
          value: zNullishString(zNonEmptyString),
        }),
        z.object({
          type: z.literal("number"),
          value: z.number(),
        }),
      ]);

      expect(schema.parse({ type: "text", value: "" })).toEqual({
        type: "text",
        value: null,
      });
      expect(schema.parse({ type: "text", value: "hello" })).toEqual({
        type: "text",
        value: "hello",
      });
      expect(schema.parse({ type: "number", value: 42 })).toEqual({
        type: "number",
        value: 42,
      });
    });

    test("works with intersection types", () => {
      const baseSchema = z.object({
        id: z.string(),
        name: zNullishString(zNonEmptyString),
      });

      const extendedSchema = baseSchema.and(
        z.object({
          email: zNullishString(z.string().trim().min(1).pipe(z.email())),
        }),
      );

      const result = extendedSchema.parse({
        id: "123",
        name: "",
        email: "user@example.com",
      });

      expect(result).toEqual({
        id: "123",
        name: null,
        email: "user@example.com",
      });
    });
  });

  describe("backwards compatibility", () => {
    test("maintains original test case behavior", () => {
      const schema = zNullishString(zNonEmptyString.max(80));
      expect(schema.parse("")).toBeNull();
      expect(schema.parse("    ")).toBeNull();
      expect(schema.safeParse("")).toEqual({ success: true, data: null });
      expect(schema.safeParse(null)).toEqual({ success: true, data: null });
      expect(schema.safeParse(" this is my string ")).toEqual({
        success: true,
        data: "this is my string",
      });
    });
  });
});
