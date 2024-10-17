"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.converterOpt = void 0;
exports.default = renderShowdown;
exports.renderMarkdownIt = renderMarkdownIt;
const markdown_it_1 = __importDefault(require("markdown-it"));
const markdown_it_abbr_1 = __importDefault(require("markdown-it-abbr"));
const markdown_it_anchor_1 = __importDefault(require("markdown-it-anchor"));
const markdown_it_attrs_1 = __importDefault(require("markdown-it-attrs"));
const markdown_it_footnote_1 = __importDefault(require("markdown-it-footnote"));
const markdown_it_mark_1 = __importDefault(require("markdown-it-mark"));
const markdown_it_sub_1 = __importDefault(require("markdown-it-sub"));
const markdown_it_sup_1 = __importDefault(require("markdown-it-sup"));
const showdown_1 = __importDefault(require("showdown"));
const index_1 = __importDefault(require("../node/slugify/index"));
exports.converterOpt = {
    strikethrough: true,
    tables: true,
    tablesHeaderId: true
};
/**
 * Transform markdown string to html string
 * @package showdown
 * @param str
 */
function renderShowdown(str) {
    const converter = new showdown_1.default.Converter(exports.converterOpt);
    return converter.makeHtml(str);
}
const md = new markdown_it_1.default('default', {
    html: true,
    // Autoconvert URL-like text to links
    linkify: false,
    // Enable some language-neutral replacement + quotes beautification
    // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
    typographer: true,
    breaks: false,
    langPrefix: 'language-' // CSS language prefix for fenced blocks. Can be useful for external highlighters.
});
//md.linkify.set({ fuzzyEmail: false }); // disables converting email to link
md.use(markdown_it_sup_1.default)
    .use(markdown_it_sub_1.default)
    .use(markdown_it_mark_1.default)
    .use(markdown_it_abbr_1.default)
    .use(markdown_it_footnote_1.default)
    .use(markdown_it_attrs_1.default, {
    allowedAttributes: ['id', 'class', /^regex.*$/]
})
    .use(markdown_it_anchor_1.default, {
    permalink: markdown_it_anchor_1.default.permalink.headerLink(),
    slugify: (s) => (0, index_1.default)(s)
});
md.renderer.rules.footnote_block_open = () => '<h4 class="mt-3">Footnotes</h4>\n' +
    '<section class="footnotes">\n' +
    '<ol class="footnotes-list">\n';
/**
 * Render markdown to html using `markdown-it`, `markdown-it-attrs`, `markdown-it-anchors`, `markdown-it-sup`, `markdown-it-sub`, `markdown-it-mark`, `markdown-it-footnote`, `markdown-it-abbr`
 * * {@link https://www.npmjs.com/package/markdown-it-attrs}
 * * {@link https://www.npmjs.com/package/markdown-it-attrs}
 * * {@link https://www.npmjs.com/package/markdown-it-anchors}
 * * {@link https://www.npmjs.com/package/markdown-it-sup}
 * * {@link https://www.npmjs.com/package/markdown-it-sub}
 * * {@link https://www.npmjs.com/package/markdown-it-mark}
 * * {@link https://www.npmjs.com/package/markdown-it-footnote}
 * * {@link https://www.npmjs.com/package/markdown-it-abbr}
 * @param str
 * @returns
 */
function renderMarkdownIt(str) {
    return md.render(str, {});
}
