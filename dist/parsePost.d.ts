import { postMap } from './types/postMap';
import { ProjectConfig } from './types/_config';
/**
 * Post author object type
 */
export interface postAuthor extends Object {
    [key: string]: any;
    /**
     * Author name
     */
    name?: string;
    /**
     * Author email
     */
    email?: string;
    /**
     * Author website url
     */
    link?: string;
}
export interface ParseOptions {
    shortcodes?: {
        /**
         * Transform shortcode `<!-- css path/to/file.css -->`
         */
        css: boolean;
        /**
         * Transform shortcode `<!-- script path/to/file.js -->`
         */
        script: boolean;
        /**
         * Transform shortcode `<!-- include path/to/file -->`
         */
        include: boolean;
        /**
         * Transform shortcode `{% youtube id 'type' %}` tag
         */
        youtube: boolean;
        /**
         * Transform hyperlinks ends with `path/to/file.md` with `path/to/file.html`
         */
        link: boolean;
        /**
         * Transform shortcode `<!-- extract-text path/to/file -->`
         * @see {@link extractText}
         */
        text: boolean;
        /**
         * Transform shortcode `<!-- now() -->`
         * @see {@link shortcodeNow}
         */
        now: boolean;
        codeblock: boolean;
    };
    cache?: boolean;
    /**
     * Source File, keep empty when first parameter (text) is file
     */
    sourceFile?: null | string;
    /**
     * Format dates?
     */
    formatDate?: boolean | {
        pattern: string;
    };
    /**
     * Site Config
     */
    config?: ProjectConfig;
    /**
     * run auto fixer such as thumbnail, excerpt, etc
     */
    fix?: boolean;
}
/**
 * make all properties as optional recursively
 */
export declare type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
/**
 * null | type
 */
export declare type Nullable<T> = T | null | undefined;
/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return {@link postMap} metadata {string & object} and body
 * * return {@link null} == failed
 * @param target file path or string markdown contents (used for cache key)
 * @param options options parser
 * * {@link ParseOptions.sourceFile} used for cache key when `target` is file contents
 */
export declare function parsePost(target: string, options?: DeepPartial<ParseOptions>): Promise<postMap>;
export default parsePost;
