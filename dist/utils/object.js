"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortObjectByKeys = void 0;
/**
 * sort object keys alphabetically or reversed
 * @param obj
 * @param param1
 * @see {@link https://stackoverflow.com/a/72773057/6404439}
 * @returns
 */
const sortObjectByKeys = (obj, { desc = false } = {}) => Object.fromEntries(Object.entries(obj).sort(([k1], [k2]) => (k1 < k2 !== desc ? -1 : 1)));
exports.sortObjectByKeys = sortObjectByKeys;
