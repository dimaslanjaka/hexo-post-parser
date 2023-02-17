"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.parse = exports.postPath = void 0;
const filemanager_1 = require("../node/filemanager");
const _config_1 = require("../types/_config");
const toHtml_1 = require("./toHtml");
const transformPosts_1 = require("./transformPosts");
const postPath = (0, filemanager_1.join)(_config_1.root, 'src-posts', '/2022/05/fully-lazy-loaded-adsense.md');
exports.postPath = postPath;
const parse = (0, transformPosts_1.parsePost)(postPath, postPath, false);
exports.parse = parse;
const render = (0, toHtml_1.renderBodyMarkdown)(parse, true);
exports.render = render;
//# sourceMappingURL=toHtml.test.js.map