"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPost = void 0;
const tslib_1 = require("tslib");
const yaml = tslib_1.__importStar(require("yaml"));
const parsePost_1 = require("./parsePost");
/**
 * Rebuild {@link parsePost} result to markdown post back
 * @param parsed parsed post return {@link parsePost}
 * @returns
 */
function buildPost(parsed) {
    if (parsed.metadata)
        return `---\n${yaml.stringify(parsed.metadata)}---\n\n${parsed.body}`;
    return parsed.body;
}
exports.buildPost = buildPost;
function _dummy() {
    return { parsePost: parsePost_1.parsePost };
}
exports.default = buildPost;
//# sourceMappingURL=buildPost.js.map