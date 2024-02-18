/// <reference types="node/fs" />
/// <reference types="fs-extra/node_modules/@types/node/fs" />
import fs from 'fs';
/**
 * Current date time
 * @return string ex> '2012-11-04 14:55:45'
 */
export declare function now(): string;
/**
 * Transform `now shortcode` to current formatted time
 * ```html
 * <!-- now() -->
 * ```
 * @param file
 * @see {@link now}
 */
export declare function shortcodeNow(file: string | fs.PathLike, read: string): string;
export default shortcodeNow;
