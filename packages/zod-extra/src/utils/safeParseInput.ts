import type { SafeParseReturnType, z } from "zod";

/**
 * Runs a Zod schema on an input and returns the safely parsed output.
 * @param schema
 * @param input
 * @returns
 */
export function safeParseInput<TInput, TOutput>(
  schema: z.ZodType<TOutput, z.ZodTypeDef, TInput>,
  input: TInput,
): SafeParseReturnType<TInput, TOutput> {
  return schema.safeParse(input);
}
