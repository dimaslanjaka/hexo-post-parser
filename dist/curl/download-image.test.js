"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const upath_1 = require("upath");
const download_image_1 = __importDefault(require("./download-image"));
console.clear();
const tmp = (0, upath_1.join)(__dirname, 'tmp');
if (!(0, fs_extra_1.existsSync)(tmp))
    (0, fs_extra_1.mkdirSync)(tmp, { recursive: true });
// download to dir
const toDir = (0, download_image_1.default)('https://avatars.githubusercontent.com/u/32372333?v=4&s=160', tmp);
//# sourceMappingURL=download-image.test.js.map