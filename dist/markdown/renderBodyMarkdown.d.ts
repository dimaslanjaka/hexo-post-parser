/// <reference types="node" />
import { default as events } from 'events';
import { postMap } from '../types/postMap';
/**
 * * group 0 = whole codeblock
 * * group 1 = code language when exist otherwise inner codeblock
 * * group 2 = inner codeblock
 */
export declare const re_code_block: RegExp;
export declare const re_inline_code_block: RegExp;
export declare const re_script_tag: RegExp;
export declare const re_style_tag: RegExp;
interface RenderBodyOptions extends Partial<postMap> {
    /**
     * enable dump
     */
    verbose?: boolean;
    /**
     * the content
     */
    body: string;
}
interface ClassEvents {
    beforeRender: (body: string) => void;
    afterRender: (body: string) => void;
}
interface RenderMarkdownBody {
    on<U extends keyof ClassEvents>(event: U, listener: ClassEvents[U]): this;
    emit<U extends keyof ClassEvents>(event: U, ...args: Parameters<ClassEvents[U]>): boolean;
}
declare class RenderMarkdownBody extends events.EventEmitter {
    private options;
    private codeBlocks;
    private styleScriptBlocks;
    constructor(options: RenderBodyOptions);
    /**
     * extract markdown codeblock
     */
    extractCodeBlock(): this;
    private re;
    extractStyleScript(): this;
    restoreCodeBlock(): this;
    restoreStyleScript(): this;
    renderMarkdown(): this;
    /**
     * get the content
     * @returns
     */
    getContent(): string;
    /**
     * update the content
     * @param content
     */
    setContent(content: string): this;
}
export { RenderMarkdownBody };
/**
 * Fixable render markdown mixed with html
 * * render {@link postMap.body}
 * @todo render markdown to html
 * @param options
 * @returns
 */
export default function renderBodyMarkdown(options: RenderBodyOptions): string;
