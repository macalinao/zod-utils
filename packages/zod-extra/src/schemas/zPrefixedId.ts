import type { z } from "zod";
import type { PrefixedString } from "./zPrefixedString.js";
import { zPrefixedString } from "./zPrefixedString.js";

export type PrefixMapping = Record<string, string>;

export type PrefixedTable<TMapping extends PrefixMapping> = keyof TMapping &
  string;

export type PrefixedId<
  TMapping extends PrefixMapping,
  TTable extends PrefixedTable<TMapping>,
> = PrefixedString<TMapping[TTable]>;

export type ZodPrefixedId<
  TMapping extends PrefixMapping,
  TTable extends PrefixedTable<TMapping>,
> = z.ZodType<PrefixedId<TMapping, TTable>>;

const makeZPrefixedId = <
  TMapping extends PrefixMapping,
  TTable extends PrefixedTable<TMapping>,
>(
  map: TMapping,
  table: TTable,
): ZodPrefixedId<TMapping, TTable> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const prefix = map[table]!;
  return zPrefixedString(prefix, `${table} ID`);
};

/**
 * A set of Zod schemas for a given mapping of table names to prefixes.
 */
export type IDSchemas<TMapping extends PrefixMapping> = {
  [K in PrefixedTable<TMapping>]: ZodPrefixedId<TMapping, K>;
};

/**
 * Generates a set of Zod schemas for a given mapping of table names to prefixes.
 */
export const makeIDSchemas = <TMapping extends PrefixMapping>(
  map: TMapping,
): IDSchemas<TMapping> =>
  Object.fromEntries(
    Object.keys(map).map(
      (table): [PrefixedTable<TMapping>, ZodPrefixedId<TMapping, string>] => {
        return [table, makeZPrefixedId(map, table)];
      },
    ),
  ) as IDSchemas<TMapping>;
