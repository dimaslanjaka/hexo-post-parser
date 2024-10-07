/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { default as events } from 'events';
import { join, write } from '../node/filemanager';
import { postMap } from '../types/postMap';
import { renderMarkdownIt } from './toHtml';

/**
 * * group 0 = whole codeblock
 * * group 1 = code language when exist otherwise inner codeblock
 * * group 2 = inner codeblock
 */
export const re_code_block = /^```\s?(\w.*\s+)?([\s\S]*?)```/gm;
export const re_inline_code_block = /`([^`\n\r]+)`/gm;
export const re_script_tag = /<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/gim;
export const re_style_tag = /<style\b[^>]*>[\s\S]*?<\/style\b[^>]*>/gim;

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
  // beforeExtractCodeblock: (codeblock: string) => string;
}

interface RenderMarkdownBody {
  on<U extends keyof ClassEvents>(event: U, listener: ClassEvents[U]): this;

  emit<U extends keyof ClassEvents>(
    event: U,
    ...args: Parameters<ClassEvents[U]>
  ): boolean;
}

class RenderMarkdownBody extends events.EventEmitter {
  private options: RenderBodyOptions;
  private codeBlocks: string[] = [];
  private styleScriptBlocks = {
    script: [] as string[],
    style: [] as string[]
  };

  constructor(options: RenderBodyOptions) {
    super();
    // fix when body assigned to property content
    if (!options.body) options.body = options.content;
    this.options = options;
  }

  /**
   * extract markdown codeblock
   */
  extractCodeBlock() {
    // eslint-disable-next-line prefer-const
    let { body, verbose } = this.options;

    // extract code block first
    const codeBlocks: string[] = [];
    Array.from(body.matchAll(re_code_block)).forEach((m, i) => {
      const str = m[0];
      codeBlocks[i] = str;
      body = body.replace(str, `<codeblock${i}/>`);
    });
    if (verbose) {
      write(join(process.cwd(), 'tmp/extracted-codeblock.json'), codeBlocks);
    }
    // apply
    this.codeBlocks = codeBlocks;
    this.options.body = body;
    return this;
  }

  getExtractedCodeblock() {
    return this.codeBlocks;
  }

  private re = {
    script: re_script_tag,
    style: re_style_tag
  };

  extractStyleScript() {
    // eslint-disable-next-line prefer-const
    let { body, verbose } = this.options;
    const re = this.re;
    const extracted = this.styleScriptBlocks;
    for (const key in re) {
      if (Object.prototype.hasOwnProperty.call(re, key)) {
        const regex = re[key as keyof typeof extracted];
        Array.from(body.matchAll(regex)).forEach((m, i) => {
          const str = m[0];
          extracted[key as keyof typeof extracted][i] = str;
          body = body.replace(str, `<!--${key}${i}-->`);
        });
      }
    }
    if (verbose) {
      write(join(process.cwd(), 'tmp/extracted-body.md'), body);
      write(join(process.cwd(), 'tmp/extracted-object.json'), extracted);
    }
    // apply
    this.styleScriptBlocks = extracted;
    this.options.body = body;
    return this;
  }

  getExtractedStyleScript() {
    return this.styleScriptBlocks;
  }

  restoreCodeBlock() {
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
        const extractmatch =
          extracted[keyname as keyof typeof extracted][index];
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
    const rendered = renderMarkdownIt(body);
    if (verbose) write(join(process.cwd(), 'tmp/rendered.md'), rendered);
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
  setContent(content: string) {
    this.options.body = content;
    return this;
  }
}

export { RenderMarkdownBody };

/**
 * Fixable render markdown mixed with html
 * * render {@link postMap.body}
 * @todo render markdown to html
 * @param options
 * @returns
 */
export default function renderBodyMarkdown(options: RenderBodyOptions) {
  if (!options) throw new Error('cannot render markdown of undefined');

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

  if (verbose) write(join(process.cwd(), 'tmp/restored.md'), rendered);
  return rendered;
}
