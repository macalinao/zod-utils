import type { z } from "zod";

export class ParseArrayError extends Error {
  constructor(
    readonly index: number,
    readonly zodError: z.ZodError,
  ) {
    super(`Error parsing element ${index.toString()}: ${zodError.message}`);
    this.name = "ParseArrayError";
  }
}

/**
 * Parses an array of values iteratively.
 *
 * This is useful for very large arrays, because Zod will keep the entire array in memory.
 *
 * @param schema - The Zod schema to parse the array with.
 * @param list - The array of values to parse.
 * @returns The parsed array.
 */
export const parseArrayWithSchema = <T extends z.ZodType>(
  schema: T,
  list: unknown[],
): z.output<T>[] => {
  return list.map((el, i): z.output<T> => {
    const result = schema.safeParse(el);
    if (!result.success) {
      throw new ParseArrayError(i, result.error);
    }
    return result.data;
  });
};
