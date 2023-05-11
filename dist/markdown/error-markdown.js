"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOL = void 0;
const upath_1 = require("upath");
const filemanager_1 = require("../node/filemanager");
const md5_file_1 = require("../node/md5-file");
exports.EOL = '\n';
/**
 * Error markdown logger
 */
class ErrorMarkdown {
    constructor(obj, hash) {
        this.result = {};
        // assign the error class name in your custom error (as a shortcut)
        this.name = this.constructor.name;
        // capturing the stack trace keeps the reference to your error class
        Error.captureStackTrace(this, this.constructor);
        const e = new Error();
        const frame = e.stack.split('\n')[2]; // change to 3 for grandparent func
        //const lineNumber = frame.split(':').reverse()[1];
        //const functionName = frame.split(' ')[5];
        this.filelog =
            (0, upath_1.join)(process.cwd(), 'tmp', 'errors', (0, md5_file_1.md5)(hash ? hash : (0, upath_1.toUnix)(frame))) +
                '.md';
        this.message = 'error messages log at ' + this.filelog;
        if (typeof obj == 'object') {
            if (!Array.isArray(obj)) {
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        const value = obj[key];
                        this.result[key] = value;
                    }
                }
            }
            this.writeLog();
        }
        return this;
    }
    /**
     * add log property
     * @param k
     * @param v
     * @returns
     */
    add(k, v) {
        this.result[k] = v;
        this.writeLog();
        return this;
    }
    /**
     * log writter
     * @returns
     */
    writeLog() {
        (0, filemanager_1.write)(this.filelog, this.toString());
        return this;
    }
    getFileLog() {
        return this.filelog;
    }
    /**
     * Remove property log
     * @param k
     * @returns
     */
    remove(k) {
        delete this.result[k];
        this.writeLog();
        return this;
    }
    toString() {
        const object = this.result;
        const separator = exports.EOL + '/'.repeat(10) + exports.EOL;
        let result = '';
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                let value = object[key];
                if (typeof value == 'object') {
                    value = '```json\n' + JSON.stringify(value, null, 2) + '\n```\n';
                }
                result += separator + key + separator + exports.EOL.repeat(2) + value;
            }
        }
        return result;
    }
}
exports.default = ErrorMarkdown;
