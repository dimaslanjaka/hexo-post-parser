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
const process_1 = require("process");
const upath_1 = require("upath");
const filemanager_1 = require("../node/filemanager");
const parsePost_1 = __importDefault(require("../parsePost"));
const codeblock_1 = require("./codeblock");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const file = (0, upath_1.join)((0, process_1.cwd)(), 'src-posts/Tests/codeblock.md');
    const parse = yield (0, parsePost_1.default)(file);
    const extract = yield (0, codeblock_1.shortcodeCodeblock)(parse.body);
    (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/codeblock.html'), extract);
}))();
//# sourceMappingURL=codeblock.test.js.map