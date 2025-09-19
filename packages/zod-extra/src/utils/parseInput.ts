import type { z } from "zod";

/**
 * Runs a Zod schema on an input and returns the parsed output.
 * @param schema
 * @param input
 * @returns
 */
export function parseInput<TInput, TOutput>(
  schema: z.ZodType<TOutput, TInput>,
  input: TInput,
): TOutput {
  return schema.parse(input);
}
