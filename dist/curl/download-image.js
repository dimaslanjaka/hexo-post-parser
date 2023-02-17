"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse_base64_image = exports.base64_to_image = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_extra_1 = require("fs-extra");
const filemanager_1 = require("../node/filemanager");
const md5_file_1 = require("../node/md5-file");
const _config_1 = __importDefault(require("../types/_config"));
/**
 * download images
 * @param src source url string
 * @param saveTo save directory path or file path
 * * If the Save target is a directory, then the file name will be searched by the 'Content-Disposition' header or based on MD5 Hash Source URL
 */
function downloadImage(src, saveTo, cache = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const e = new Error();
        if (!e.stack) {
            try {
                // IE requires the Error to actually be thrown or else the
                // Error's 'stack' property is undefined.
                throw e;
            }
            catch (e) {
                if (!e.stack) {
                    //return 0; // IE < 10, likely
                }
            }
        }
        const stack = e.stack
            .toString()
            .split(/\r\n|\n/)
            .map((path) => {
            const split = path.split(':').map((s) => s.replace(/at\s/, '').trim());
            return {
                path: split[0],
                line: `${split[1]}:${split[2]}`
            };
        });
        const cacheLocation = (0, filemanager_1.join)(filemanager_1.cacheDir, (0, md5_file_1.md5)(stack[1].path), (0, md5_file_1.md5)(stack[1].line), (0, md5_file_1.md5)(saveTo));
        if (cache) {
            if ((0, fs_extra_1.existsSync)(cacheLocation)) {
                const parse = JSON.parse((0, fs_extra_1.readFileSync)(cacheLocation).toString());
                const parseB64 = parse_base64_image(parse.content);
                const convert = base64_to_image(parseB64.base64, parse.path, null, null);
                if (typeof convert == 'string') {
                    parse.path = convert;
                    return parse;
                }
            }
        }
        const response = yield (0, axios_1.default)({
            method: 'get',
            url: src,
            responseType: 'stream'
        });
        if (response.status === 200) {
            const mime = response.headers['content-type'];
            if (mime.startsWith('image')) {
                let filename = null;
                // get content disposition information
                if (Object.hasOwnProperty.call(response.headers, 'content-disposition')) {
                    filename = response.headers['content-disposition'].match(new RegExp('filename=(.*)'))[1].replace(/["]/gm, '');
                }
                // no content-disposition
                if (filename === null) {
                    const ext = '.' + mime.split('/')[1];
                    //return response.data.pipe(createWriteStream(tmp('downloaded-images', md5(src) + ext)));
                    filename = (0, md5_file_1.md5)(src) + ext;
                }
                if (typeof saveTo == 'string') {
                    let stats;
                    if ((0, fs_extra_1.existsSync)(saveTo))
                        stats = (0, fs_extra_1.statSync)(saveTo);
                    let pipe = null;
                    // save to directory
                    if (stats && stats.isDirectory()) {
                        pipe = response.data.pipe((0, fs_extra_1.createWriteStream)((0, filemanager_1.join)(saveTo, filename)));
                    }
                    else {
                        pipe = response.data.pipe((0, fs_extra_1.createWriteStream)(saveTo));
                    }
                    const result = {
                        /** save location */
                        path: null,
                        /** writable stream */
                        pipe
                    };
                    if (Object.hasOwnProperty.call(pipe, 'path')) {
                        if (_config_1.default.verbose)
                            console.log('saved to', pipe['path']);
                        result.path = pipe['path'];
                    }
                    if (result.path) {
                        const b64 = `data:${mime};base64,` + (0, fs_extra_1.readFileSync)(result.path).toString('base64');
                        (0, filemanager_1.write)(cacheLocation, {
                            path: result.path,
                            content: b64
                        });
                    }
                    return result;
                }
            }
        }
    });
}
exports.default = downloadImage;
/**
 * parse image base64 encoded
 * @param data
 * @returns
 */
function parse_base64_image(data) {
    const reg = /^data:image\/([\w+]+);base64,([\s\S]+)/;
    const match = data.match(reg);
    const baseType = {
        jpeg: 'jpg'
    };
    baseType['svg+xml'] = 'svg';
    if (!match) {
        throw new Error('image base64 data error');
    }
    const extname = baseType[match[1]] ? baseType[match[1]] : match[1];
    return {
        /** extension name */
        extname: '.' + extname,
        /** base64 encoded */
        base64: match[2]
    };
}
exports.parse_base64_image = parse_base64_image;
/**
 * Convert image base64 data to img
 *
 * @param data
 * @param destpath
 * @param name default null
 * @param callback default null
 * @returns string path file
 * @example
 * // save to directory with filename
 * base64_to_image('data:image/png;base64,...', '/folder/name', 'file-name', function(err, filepath) {});
 * // remove first data:image/png;base64, from {@param data}
 * // save to file directly with callback
 * base64_to_image('base64_encoded_string', '/folder/filename.jpg', null, function(err, filepath) {});
 * // save to file directly without callback, return string
 * base64_to_image('base64_encoded_string', '/folder/filename.jpg', null, null);
 */
function base64_to_image(data, destpath, name = null, callback = null) {
    if (typeof data === 'string' && typeof name === 'string') {
        let filepath;
        if (data.startsWith('data:image')) {
            // if data:image persist
            const result = parse_base64_image(data);
            filepath = (0, filemanager_1.join)(destpath, name + result.extname);
            if (typeof callback === 'function') {
                return (0, fs_extra_1.writeFile)(filepath, result.base64, { encoding: 'base64' }, function (err) {
                    callback(err, filepath);
                });
            }
            (0, fs_extra_1.writeFileSync)(filepath, result.base64, { encoding: 'base64' });
        }
        else {
            filepath = destpath;
            if (typeof callback === 'function') {
                return (0, fs_extra_1.writeFile)(filepath, data, { encoding: 'base64' }, function (err) {
                    callback(err, filepath);
                });
            }
            (0, fs_extra_1.writeFileSync)(filepath, data, { encoding: 'base64' });
        }
        return filepath;
    }
}
exports.base64_to_image = base64_to_image;
//# sourceMappingURL=download-image.js.map