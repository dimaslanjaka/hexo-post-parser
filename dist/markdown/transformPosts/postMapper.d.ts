import { postMap } from '../../types/postMap';
/**
 * Partializing properties
 * @see {@link https://stackoverflow.com/a/40076355/6404439}
 */
export type Partial<T> = {
    [P in keyof T]?: T[P];
};
/**
 * Partializing properties deeper
 * @see {@link https://stackoverflow.com/a/40076355/6404439}
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};
/**
 * mapped type
 */
export type mergedPostMap = DeepPartial<postMap & postMap['metadata']>;
export interface archiveMap extends mergedPostMap {
    [key: string]: any;
    /**
     * previous page items
     */
    prev?: mergedPostMap[] | null;
    /**
     * next page items
     */
    next?: mergedPostMap[] | null;
    /**
     * current page number
     */
    page_now?: number;
    /**
     * next page number
     */
    page_next?: number;
    /**
     * next page url (only visible on archive generator)
     */
    page_next_url?: string;
    /**
     * previous page url (only visible on archive generator)
     */
    page_prev_url?: string;
    /**
     * previous page number
     */
    page_prev?: number;
    /**
     * page total
     */
    total?: number;
}
/**
 * Transform post object
 * * merge post metadata property ({@link postMap.metadata}) to root property
 * @returns
 */
export default function postMapper(post: postMap): archiveMap;
/**
 * transform array into an mapped chunks
 * @param chunks
 * @returns
 */
export declare function postChunksMapper<T extends any[][]>(chunks: T): T;
export declare function array_wrap<T extends any[]>(arr: T): T;
export interface DumperType extends Object {
    [key: string]: any;
    next: any;
    prev: any;
    posts: any[];
    content: string;
}
export declare function simplifyDump<T>(post: T, except?: string[] | string): T;
export declare function simplifyDump<T extends any[]>(post: T, except?: string[] | string): T;
