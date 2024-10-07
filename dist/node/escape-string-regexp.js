"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = escapeStringRegexp;
/**
 * escape string for regexp
 * @link https://github.com/sindresorhus/escape-string-regexp
 * @param str string to escape
 * @returns
 */
function escapeStringRegexp(str) {
    if (typeof str !== 'string') {
        throw new TypeError('Expected a string');
    }
    // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}
