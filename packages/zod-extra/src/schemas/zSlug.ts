import type { z } from "zod";

import { zNonEmptyString } from "./zNonEmptyString.js";

/**
 * A slug is a string of lowercase alphanumeric characters, hyphens, and underscores.
 */
export const zSlug: z.ZodString = zNonEmptyString.regex(
  /^[a-z0-9-]+$/,
  "Invalid slug",
);
