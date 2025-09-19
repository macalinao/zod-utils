import type { ZodSafeParseResult, z } from "zod";

/**
 * Runs a Zod schema on an input and returns the safely parsed output.
 * @param schema
 * @param input
 * @returns
 */
export function safeParseInput<TInput, TOutput>(
  schema: z.ZodType<TOutput, TInput>,
  input: TInput,
): ZodSafeParseResult<TOutput> {
  return schema.safeParse(input);
}
