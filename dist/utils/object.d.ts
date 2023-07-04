/**
 * sort object keys alphabetically or reversed
 * @param obj
 * @param param1
 * @see {@link https://stackoverflow.com/a/72773057/6404439}
 * @returns
 */
export declare const sortObjectByKeys: <T extends Record<string, any>>(obj: T, { desc }?: {
    desc?: boolean;
}) => T;
