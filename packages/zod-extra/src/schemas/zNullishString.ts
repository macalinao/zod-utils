import { z } from "zod";

/**
 * A Zod schema that converts empty or undefined strings to null.
 */
export const zNullishString = <TOutput, TInput extends string>(
  inner: z.ZodType<TOutput, TInput>,
): z.ZodType<TOutput | null, TInput | string | null | undefined> =>
  z.union([
    // preserve the inner type
    inner,
    // empty strings become null
    z
      .string()
      .trim()
      .length(0)
      .transform(() => null),
    // null is allowed
    z.null(),
    // undefined becomes null
    z
      .undefined()
      .transform(() => null),
  ]);
