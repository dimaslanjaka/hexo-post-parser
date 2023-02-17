"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParsed = exports.buildPost = exports.saveParsedPost = exports.parsePost = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const filemanager_1 = require("../node/filemanager");
const yaml_1 = __importDefault(require("yaml"));
const color_1 = __importDefault(require("../node/color"));
var parsePost_1 = require("./transformPosts/parsePost");
Object.defineProperty(exports, "parsePost", { enumerable: true, get: function () { return parsePost_1.parsePost; } });
/**
 * Save Parsed Hexo markdown post
 * @param parsed return {@link parsePost}
 * @param file file path to save
 */
function saveParsedPost(parsed, file) {
    if (!(0, filemanager_1.existsSync)((0, filemanager_1.dirname)(file)))
        (0, filemanager_1.mkdirSync)((0, filemanager_1.dirname)(file), { recursive: true });
    (0, filemanager_1.writeFileSync)(file, buildPost(parsed));
}
exports.saveParsedPost = saveParsedPost;
/**
 * Rebuild {@link parsePost} result to markdown post back
 * @param parsed parsed post return {@link parsePost}
 * @returns
 */
function buildPost(parsed) {
    return `---\n${yaml_1.default.stringify(parsed.metadata)}---\n\n${parsed.body}`;
}
exports.buildPost = buildPost;
/**
 * validate {@link parsePost}
 * @param parse
 * @returns
 */
const validateParsed = (parse) => {
    if (parse === null)
        return false;
    if (typeof parse === 'undefined')
        return false;
    if (parse && !parse.body) {
        console.log(color_1.default['Red Orange']('body of null:'));
        return false;
    }
    return true;
};
exports.validateParsed = validateParsed;
//# sourceMappingURL=transformPosts.js.map