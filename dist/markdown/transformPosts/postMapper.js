"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateMapper = exports.simplifyDump = exports.array_wrap = exports.postChunksMapper = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/**
 * Transform post object
 * * merge post metadata property ({@link postMap.metadata}) to root property
 * @returns
 */
function postMapper(post) {
    post.metadata.date = new dateMapper(post.metadata.date);
    return Object.assign(post, post.metadata);
}
exports.default = postMapper;
/**
 * transform array into an mapped chunks
 * @param chunks
 * @returns
 */
function postChunksMapper(chunks) {
    const defaultMap = {
        page_next: null,
        page_now: null,
        page_next_url: null,
        page_prev: null,
        page_prev_url: null
    };
    chunks.map((arr_chunk, i) => {
        if (Array.isArray(arr_chunk)) {
            const ret = arr_chunk.map((post) => {
                post.page_now = i;
                post.page_next = i + 1;
                post.page_prev = i - 1;
                if (post.page_prev === -1)
                    post.page_prev = null;
                post.total = chunks.length;
                if (Array.isArray(chunks[post.page_prev])) {
                    post.prev = chunks[post.page_prev];
                }
                if (Array.isArray(chunks[post.page_next])) {
                    post.next = chunks[post.page_next];
                }
                return Object.assign(defaultMap, post);
            });
            return ret;
        }
        return arr_chunk;
    });
    return chunks;
}
exports.postChunksMapper = postChunksMapper;
function array_wrap(arr) {
    arr['each'] = arr.forEach;
    return arr;
}
exports.array_wrap = array_wrap;
/**
 * simplified dump
 * @param post
 * @returns
 */
function simplifyDump(post, except = []) {
    if (Array.isArray(post))
        return post.map((o) => simplifyDump(o, except));
    if (typeof post == 'object' && post !== null) {
        if ('posts' in post) {
            const archivePosts = post['posts'];
            if (Array.isArray(archivePosts)) {
                post['posts'] = archivePosts.map((o) => simplifyDump(o, except));
            }
        }
        const keyToRemove = [
            'config',
            'body',
            'prev',
            'next',
            'content',
            'body',
            'sitedata',
            'author'
        ].filter(function (el) {
            if (Array.isArray(except)) {
                return except.indexOf(el) < 0;
            }
            else {
                return el === except;
            }
        });
        for (const key in post) {
            if (Object.prototype.hasOwnProperty.call(post, key)) {
                if (keyToRemove.includes(key)) {
                    if (post[key])
                        post[key] = `[${typeof post[key]}]`;
                }
            }
        }
        for (const key in post['metadata']) {
            if (Object.prototype.hasOwnProperty.call(post['metadata'], key)) {
                if (keyToRemove.includes(key)) {
                    if (post['metadata'][key])
                        post['metadata'][key] =
                            '[' + typeof post['metadata'][key] + ']';
                }
            }
        }
    }
    return post;
}
exports.simplifyDump = simplifyDump;
/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
class dateMapper {
    constructor(date) {
        this.format = (pattern) => this.data.format(pattern);
        this.year = () => this.data.format('YYYY');
        this.toString = () => this.data.format('YYYY-MM-DDTHH:mm:ssZ');
        if (typeof date == 'string') {
            this.data = (0, moment_timezone_1.default)(date);
        }
    }
}
exports.dateMapper = dateMapper;
