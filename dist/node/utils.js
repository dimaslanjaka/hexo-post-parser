"use strict";
/**
 * clean white spaces
 * @param s
 * @returns
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanWhiteSpace = cleanWhiteSpace;
exports.cleanString = cleanString;
exports.replaceArr = replaceArr;
function cleanWhiteSpace(text) {
    if (typeof text == 'string')
        return text.replace(/\s+/gm, ' ');
    return text;
}
/**
 * clean string with exception char
 * @param text
 * @returns
 */
function cleanString(text, exception = '.,-_ ') {
    if (typeof text == 'string')
        return text.replace(new RegExp('[^a-zA-Z0-9' + exception + ']', 'gm'), '');
    return text;
}
/**
 * Replace string by array pattern
 * @param array
 * @param replacement
 * @example
 * replaceArr('str', ['s','r'], ''); // t
 * replaceArr('str', ['s','r'], ['a s', 'ring']); // a string
 */
function replaceArr(str, array, replacement) {
    let ori = str;
    array.forEach((str, i) => {
        if (typeof replacement == 'string') {
            ori = ori.replace(str, replacement);
        }
        else {
            ori = ori.replace(str, replacement[i]);
        }
    });
    return ori;
}
