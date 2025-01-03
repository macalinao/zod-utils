import type { z } from "zod";

import { zNonEmptyString } from "./zNonEmptyString.js";

export const zSlug: z.ZodString = zNonEmptyString.regex(
  /^[a-z0-9-]+$/,
  "Invalid slug",
);
