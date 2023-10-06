"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderMarkdownBody = exports.re_style_tag = exports.re_script_tag = exports.re_inline_code_block = exports.re_code_block = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
const events_1 = __importDefault(require("events"));
const filemanager_1 = require("../node/filemanager");
const toHtml_1 = require("./toHtml");
/**
 * * group 0 = whole codeblock
 * * group 1 = code language when exist otherwise inner codeblock
 * * group 2 = inner codeblock
 */
exports.re_code_block = /^```\s?(\w.*\s+)?([\s\S]*?)```/gm;
exports.re_inline_code_block = /`([^`\n\r]+)`/gm;
exports.re_script_tag = /<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/gim;
exports.re_style_tag = /<style\b[^>]*>[\s\S]*?<\/style\b[^>]*>/gim;
class RenderMarkdownBody extends events_1.default.EventEmitter {
    constructor(options) {
        super();
        this.codeBlocks = [];
        this.styleScriptBlocks = {
            script: [],
            style: []
        };
        this.re = {
            script: exports.re_script_tag,
            style: exports.re_style_tag
        };
        // fix when body assigned to property content
        if (!options.body)
            options.body = options.content;
        this.options = options;
    }
    /**
     * extract markdown codeblock
     */
    extractCodeBlock() {
        // eslint-disable-next-line prefer-const
        let { body, verbose } = this.options;
        // extract code block first
        const codeBlocks = [];
        Array.from(body.matchAll(exports.re_code_block)).forEach((m, i) => {
            const str = m[0];
            codeBlocks[i] = str;
            body = body.replace(str, `<codeblock${i}/>`);
        });
        if (verbose) {
            (0, filemanager_1.write)((0, filemanager_1.join)(process.cwd(), 'tmp/extracted-codeblock.json'), codeBlocks);
        }
        // apply
        this.codeBlocks = codeBlocks;
        this.options.body = body;
        return this;
    }
    extractStyleScript() {
        // eslint-disable-next-line prefer-const
        let { body, verbose } = this.options;
        const re = this.re;
        const extracted = this.styleScriptBlocks;
        for (const key in re) {
            if (Object.prototype.hasOwnProperty.call(re, key)) {
                const regex = re[key];
                Array.from(body.matchAll(regex)).forEach((m, i) => {
                    const str = m[0];
                    extracted[key][i] = str;
                    body = body.replace(str, `<!--${key}${i}-->`);
                });
            }
        }
        if (verbose) {
            (0, filemanager_1.write)((0, filemanager_1.join)(process.cwd(), 'tmp/extracted-body.md'), body);
            (0, filemanager_1.write)((0, filemanager_1.join)(process.cwd(), 'tmp/extracted-object.json'), extracted);
        }
        // apply
        this.styleScriptBlocks = extracted;
        this.options.body = body;
        return this;
    }
    restoreCodeBlock() {
        // eslint-disable-next-line prefer-const
        let { body } = this.options;
        this.codeBlocks.forEach((s, i) => {
            const regex = new RegExp(`<codeblock${i}/>`, 'gm');
            Array.from(body.matchAll(regex)).forEach((codeblock) => {
                body = body.replace(codeblock[0], s);
            });
        });
        // apply
        this.options.body = body;
        return this;
    }
    restoreStyleScript() {
        const re = this.re;
        const extracted = this.styleScriptBlocks;
        let rendered = this.options.body;
        for (const key in re) {
            const regex = new RegExp(`<!--(${key})(\\d{1,2})-->`, 'gm');
            Array.from(rendered.matchAll(regex)).forEach((m) => {
                //console.log(match.length, regex, m[0], m[1], m[2]);
                const keyname = m[1];
                const index = parseInt(m[2]);
                const extractmatch = extracted[keyname][index];
                rendered = rendered.replace(m[0], extractmatch);
            });
        }
        // apply
        this.options.body = rendered;
        return this;
    }
    renderMarkdown() {
        // eslint-disable-next-line prefer-const
        let { body, verbose } = this.options;
        this.emit('beforeRender', body);
        const rendered = (0, toHtml_1.renderMarkdownIt)(body);
        if (verbose)
            (0, filemanager_1.write)((0, filemanager_1.join)(process.cwd(), 'tmp/rendered.md'), rendered);
        // apply
        this.options.body = rendered;
        return this;
    }
    /**
     * get the content
     * @returns
     */
    getContent() {
        return this.options.body;
    }
    /**
     * update the content
     * @param content
     */
    setContent(content) {
        this.options.body = content;
        return this;
    }
}
exports.RenderMarkdownBody = RenderMarkdownBody;
/**
 * Fixable render markdown mixed with html
 * * render {@link postMap.body}
 * @todo render markdown to html
 * @param options
 * @returns
 */
function renderBodyMarkdown(options) {
    if (!options)
        throw new Error('cannot render markdown of undefined');
    const c = new RenderMarkdownBody(options);
    const { verbose } = options;
    // extract code block first
    c.extractCodeBlock()
        // extract style, script
        .extractStyleScript()
        // restore extracted code blocks
        .restoreCodeBlock()
        // callbacks here
        .renderMarkdown()
        // restore extracted script, style
        .restoreStyleScript();
    const rendered = c.getContent();
    if (verbose)
        (0, filemanager_1.write)((0, filemanager_1.join)(process.cwd(), 'tmp/restored.md'), rendered);
    return rendered;
}
exports.default = renderBodyMarkdown;
