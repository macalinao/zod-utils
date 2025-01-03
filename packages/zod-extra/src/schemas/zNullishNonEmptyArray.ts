import { z } from "zod";

/**
 * Transforms zero length arrays to null.
 * @param inner
 * @returns
 */
export const zRequiredNullishNonEmptyArray = <
  TValueSchema extends z.ZodTypeAny,
>(
  inner: TValueSchema,
): z.ZodType<
  z.arrayOutputType<TValueSchema, "atleastone"> | null,
  z.ZodTypeDef,
  z.input<TValueSchema>[]
> =>
  z.union([
    inner
      .array()
      .length(0)
      .transform(() => null),
    inner.array().nonempty(),
  ]);

/**
 * Transforms zero length arrays to null, allowing for null input values.
 * @param inner
 * @returns
 */
export const zNullishNonEmptyArray = <TValueSchema extends z.ZodTypeAny>(
  inner: TValueSchema,
): z.ZodType<
  z.arrayOutputType<TValueSchema, "atleastone"> | null,
  z.ZodTypeDef,
  z.input<TValueSchema>[] | null
> => z.union([zRequiredNullishNonEmptyArray(inner), z.null()]);
