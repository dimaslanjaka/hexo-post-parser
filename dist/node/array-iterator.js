"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_iterator = void 0;
class array_iterator {
    constructor(arr) {
        this.data = arr;
    }
    /**
     * @see {@link https://stackoverflow.com/a/62889031/6404439}
     * @returns
     */
    values() {
        const items = [...this.data.values()];
        const index = -1;
        return {
            [Symbol.iterator]() {
                return this;
            },
            next() {
                const item = items[index + 1];
                if (item) {
                    return {
                        value: item,
                        done: false,
                    };
                }
                return { done: true };
            },
            previous() {
                const item = items[index - 1];
                if (item) {
                    return {
                        value: item,
                        done: false,
                    };
                }
                return { done: true };
            },
        };
    }
}
exports.array_iterator = array_iterator;
//# sourceMappingURL=array-iterator.js.map