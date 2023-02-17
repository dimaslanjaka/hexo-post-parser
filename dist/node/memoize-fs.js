"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoizeFs = void 0;
const path_1 = require("path");
const color_1 = __importDefault(require("./color"));
const filemanager_1 = require("./filemanager");
const md5_file_1 = require("./md5-file");
class memoizer {
    constructor() {
        this.cache = {};
        this.memoize = (fn) => {
            const self = this;
            return ((...args) => {
                const find = this.getCacheFilePath(fn, ...args);
                if ((0, filemanager_1.existsSync)(find)) {
                    const read = JSON.parse((0, filemanager_1.readFileSync)(find, 'utf-8'));
                    if (this.verbose)
                        console.log(color_1.default.greenBright('Fetching from cache'));
                    return read.content;
                }
                else {
                    if (this.verbose)
                        console.log(color_1.default.Red('Calculating result'));
                    const result = fn(...args);
                    const content = {
                        type: self.determineType(result),
                        content: result
                    };
                    (0, filemanager_1.write)(find, content);
                    return result;
                }
            });
        };
        /**
         * @see {@link memoizer.memoize}
         */
        this.fn = this.memoize;
        /**
         * cache directory
         */
        this.cacheDir = (0, filemanager_1.join)(filemanager_1.cacheDir, 'memoize-fs');
        this.verbose = false;
    }
    /**
     * determine function return type
     * @param arg
     * @returns
     */
    determineType(arg) {
        if (typeof arg == 'object') {
            if (Array.isArray(arg))
                return 'array';
            return 'object';
        }
        return typeof arg;
    }
    /**
     * clear cache function
     * @param fn
     */
    clear(fn, ...args) {
        const argpath = this.getCacheFilePath(fn, ...args);
        const fnpath = this.getCacheFilePath(fn);
        if ((0, filemanager_1.existsSync)(fnpath)) {
            if (this.verbose)
                console.log('found fn');
            (0, filemanager_1.rm)(fnpath, { recursive: true });
        }
        if ((0, filemanager_1.existsSync)(argpath)) {
            if (this.verbose)
                console.log('found fn args');
            (0, filemanager_1.rm)(argpath, { recursive: true });
        }
    }
    /**
     * get function cache file
     * @param fn
     * @param args
     * @returns
     */
    getCacheFilePath(fn, ...args) {
        const args1 = String(args);
        return ((...args) => {
            let pathStr = this.determinefn(fn);
            if (args1.length)
                pathStr += '/' + (0, md5_file_1.md5)(String(args1));
            if (args.length)
                pathStr += '/' + (0, md5_file_1.md5)(String(args));
            const path = (0, path_1.resolve)((0, filemanager_1.join)(this.cacheDir, pathStr));
            if (this.verbose)
                console.log(path, (0, filemanager_1.existsSync)(path));
            return path;
        })();
    }
    /**
     * determine function
     * @param fn
     * @param _args
     * @returns
     */
    determinefn(fn, ..._args) {
        const fnStr = String(fn);
        return (0, md5_file_1.md5)(fnStr);
    }
}
exports.default = memoizer;
const mem = new memoizer();
exports.memoizeFs = mem.memoize;
//# sourceMappingURL=memoize-fs.js.map