/**
 * sort object keys alphabetically or reversed
 * @param obj
 * @param param1
 * @see {@link https://stackoverflow.com/a/72773057/6404439}
 * @returns
 */
export const sortObjectByKeys = <T extends Record<string, any>>(
  obj: T,
  { desc = false } = {}
): T =>
  Object.fromEntries(
    Object.entries(obj).sort(([k1], [k2]) => (k1 < k2 !== desc ? -1 : 1))
  ) as any;
