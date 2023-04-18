"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcodeImportPost = void 0;
function shortcodeImportPost(file, str) {
    const matches = [
        /<!--\s+?include-post\s+?(.+?)\s+?-->/gim,
        /<!--\s+?import-post\s+?(.+?)\s+?-->/gim
    ]
        .map((regex) => Array.from(str.matchAll(regex)))
        .filter((m) => Array.isArray(m) && m.length);
    for (let u = 0; u < matches.length; u++) {
        const m = matches[u];
        m.forEach((t) => {
            console.log(t);
        });
    }
}
exports.shortcodeImportPost = shortcodeImportPost;
//# sourceMappingURL=import-post.js.map