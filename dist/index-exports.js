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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfig = exports.getConfig = exports.color = exports.renderMarkdown = exports.renderBodyMarkdown = void 0;
/// special exports
const fs_1 = require("fs");
const path_1 = require("path");
// [task] generate empty config if not exists
[
    (0, path_1.join)(__dirname, 'types/_config_project.json'),
    (0, path_1.join)(__dirname, 'types/_config_theme.json'),
    (0, path_1.join)(__dirname, 'types/_config_hashes.json')
].forEach((path) => {
    if (!(0, fs_1.existsSync)(path)) {
        if (!(0, fs_1.existsSync)((0, path_1.dirname)(path)))
            (0, fs_1.mkdirSync)((0, path_1.dirname)(path), { recursive: true });
        (0, fs_1.writeFileSync)(path, '{}');
    }
});
///
/// exports
__exportStar(require("./buildPost"), exports);
__exportStar(require("./generatePostId"), exports);
var renderBodyMarkdown_1 = require("./markdown/renderBodyMarkdown");
Object.defineProperty(exports, "renderBodyMarkdown", { enumerable: true, get: function () { return __importDefault(renderBodyMarkdown_1).default; } });
var toHtml_1 = require("./markdown/toHtml");
Object.defineProperty(exports, "renderMarkdown", { enumerable: true, get: function () { return toHtml_1.renderMarkdownIt; } });
exports.color = __importStar(require("./node/color"));
__exportStar(require("./parsePermalink"), exports);
__exportStar(require("./parsePost"), exports);
__exportStar(require("./parsePost-front-matter"), exports);
__exportStar(require("./types"), exports);
var _config_1 = require("./types/_config");
Object.defineProperty(exports, "getConfig", { enumerable: true, get: function () { return _config_1.getConfig; } });
Object.defineProperty(exports, "setConfig", { enumerable: true, get: function () { return _config_1.setConfig; } });
////
