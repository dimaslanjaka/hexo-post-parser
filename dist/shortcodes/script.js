"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcodeScript = void 0;
/* eslint-disable no-useless-escape */
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const upath_1 = require("upath");
const _config_1 = require("../types/_config");
const root = (0, upath_1.toUnix)(process.cwd());
const logname = chalk_1.default.blue('[script]');
/**
 * Parse shortcode script
 * ```html
 * <!-- script /path/file.js -->
 * ```
 * @param file markdown file
 * @param str content to replace
 * @returns
 */
function shortcodeScript(file, str) {
    const config = (0, _config_1.getConfig)();
    const { verbose } = config.generator;
    const log = [logname];
    const regex = /<!--\s+?script\s+?(.+?)\s+?-->/gim;
    const execs = Array.from(str.matchAll(regex));
    execs.forEach((m) => {
        const htmlTag = m[0];
        const includefile = m[1];
        const dirs = {
            directFile: (0, upath_1.join)((0, upath_1.dirname)(file.toString()), includefile),
            //cwdFile: join(cwd(), includefile),
            rootFile: (0, upath_1.join)(root, includefile)
        };
        for (const key in dirs) {
            if (Object.prototype.hasOwnProperty.call(dirs, key)) {
                const filepath = dirs[key];
                if ((0, fs_1.existsSync)(filepath)) {
                    log[0] += chalk_1.default.greenBright(`[${key}]`);
                    if (verbose)
                        console.log(...log, file);
                    const read = (0, fs_1.readFileSync)(filepath, 'utf-8');
                    str = str.replace(htmlTag, () => `<script>${read}</script>`);
                    //console.log('match tag', str.match(new RegExp(htmlTag, 'm'))[0]);
                    //write(tmp('shortcode', 'script.txt'), mod).then(console.log);
                    break;
                }
            }
        }
    });
    return str;
}
exports.shortcodeScript = shortcodeScript;
