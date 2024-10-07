"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueArray = uniqueArray;
exports.uniqueStringArray = uniqueStringArray;
function uniqueArray(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] === array[j]) {
                array.splice(j, 1);
            }
        }
    }
    return array;
}
/**
 * Unique Array Of Strings
 * @description Lowercase all string and filter duplicated from them
 * @param arr
 * @returns
 */
function uniqueStringArray(arr) {
    const filter = new Map(arr
        .filter((s) => typeof s === 'string')
        .map((s) => {
        return [s.toLowerCase(), s];
    }));
    const values = filter.values();
    /*
    return [...filter.values()];*/
    return Array.from(values).filter(function (x, i, a) {
        return a.indexOf(x) === i;
    });
}
exports.default = uniqueArray;
