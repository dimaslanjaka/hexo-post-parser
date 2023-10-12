"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePostFM = void 0;
const front_matter_1 = __importDefault(require("front-matter"));
const fs_1 = __importDefault(require("fs"));
/**
 * parse post using front-matter
 * @param source markdown post string or path
 * @returns
 */
function parsePostFM(source) {
    let content = '';
    if (fs_1.default.existsSync(source)) {
        content = fs_1.default.readFileSync(source).toString();
    }
    return (0, front_matter_1.default)(content, {
        allowUnsafe: true
    });
}
exports.parsePostFM = parsePostFM;
