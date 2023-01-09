"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPost = exports.parsePost = exports.setConfig = exports.getConfig = exports.parsePermalink = exports.color = exports.renderMarkdown = exports.generatePostId = void 0;
/// special imports
require("./a_index");
///
/// imports
const buildPost_1 = require("./buildPost");
Object.defineProperty(exports, "buildPost", { enumerable: true, get: function () { return buildPost_1.buildPost; } });
const generatePostId_1 = require("./generatePostId");
const toHtml_1 = require("./markdown/toHtml");
const parsePermalink_1 = require("./parsePermalink");
const parsePost_1 = require("./parsePost");
Object.defineProperty(exports, "parsePost", { enumerable: true, get: function () { return parsePost_1.parsePost; } });
const _config_1 = require("./types/_config");
/// exports
var generatePostId_2 = require("./generatePostId");
Object.defineProperty(exports, "generatePostId", { enumerable: true, get: function () { return generatePostId_2.generatePostId; } });
var toHtml_2 = require("./markdown/toHtml");
Object.defineProperty(exports, "renderMarkdown", { enumerable: true, get: function () { return toHtml_2.renderMarkdownIt; } });
exports.color = __importStar(require("./node/color"));
var parsePermalink_2 = require("./parsePermalink");
Object.defineProperty(exports, "parsePermalink", { enumerable: true, get: function () { return parsePermalink_2.parsePermalink; } });
var _config_2 = require("./types/_config");
Object.defineProperty(exports, "getConfig", { enumerable: true, get: function () { return _config_2.getConfig; } });
Object.defineProperty(exports, "setConfig", { enumerable: true, get: function () { return _config_2.setConfig; } });
/// object oriented export
const hexoPostParser = {
    parsePost: parsePost_1.parsePost,
    buildPost: buildPost_1.buildPost,
    generatePostId: generatePostId_1.generatePostId,
    renderMarkdown: toHtml_1.renderMarkdownIt,
    parsePermalink: parsePermalink_1.parsePermalink,
    setConfig: _config_1.setConfig,
    getConfig: _config_1.getConfig
};
exports.default = hexoPostParser;
//# sourceMappingURL=index.js.map