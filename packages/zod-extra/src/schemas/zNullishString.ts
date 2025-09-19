import { z } from "zod";

/**
 * A Zod schema that converts empty or undefined strings to null.
 */
export const zNullishString = <T extends z.ZodType<string>>(
  inner: T,
): z.ZodType<z.output<T> | null, z.ZodTypeDef, z.input<T> | null | undefined> =>
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
