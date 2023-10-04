import { join, write } from '../node/filemanager';
import { postMap } from '../types/postMap';
import { renderMarkdownIt } from './toHtml';

interface RenderBodyOptions extends postMap {
  /**
   * enable dump
   */
  verbose?: boolean;
}

/**
 * Fixable render markdown mixed with html
 * * render {@link postMap.body}
 * @todo render markdown to html
 * @param options
 * @returns
 */
export default function renderBodyMarkdown(options: RenderBodyOptions) {
  if (!options) throw new Error('cannot render markdown of undefined');
  const { verbose } = options;

  let body: string = options.body || options.content;
  if (typeof body != 'string')
    throw new Error('cannot render undefined markdown body');

  // extract code block first
  const re_code_block = /^```\s?(\w.*\s+)?([\s\S]*?)```/gm;
  const codeBlocks: string[] = [];
  Array.from(body.matchAll(re_code_block)).forEach((m, i) => {
    const str = m[0];
    codeBlocks[i] = str;
    body = body.replace(str, `<codeblock${i}/>`);
  });
  if (verbose) {
    write(join(process.cwd(), 'tmp/extracted-codeblock.json'), codeBlocks);
  }

  // extract style, script
  const re = {
    script: /<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/gim,
    style: /<style\b[^>]*>[\s\S]*?<\/style\b[^>]*>/gim
  };
  const extracted = {
    script: [] as string[],
    style: [] as string[]
  };
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

  // restore extracted code blocks
  codeBlocks.forEach((s, i) => {
    const regex = new RegExp(`<codeblock${i}/>`, 'gm');
    Array.from(body.matchAll(regex)).forEach((codeblock) => {
      body = body.replace(codeblock[0], s);
    });
  });

  // callbacks here
  let rendered = renderMarkdownIt(body);
  if (verbose) write(join(process.cwd(), 'tmp/rendered.md'), rendered);

  // restore extracted script, style
  for (const key in re) {
    const regex = new RegExp(`<!--(${key})(\\d{1,2})-->`, 'gm');
    Array.from(rendered.matchAll(regex)).forEach((m) => {
      //console.log(match.length, regex, m[0], m[1], m[2]);
      const keyname = m[1];
      const index = parseInt(m[2]);
      const extractmatch = extracted[keyname as keyof typeof extracted][index];
      rendered = rendered.replace(m[0], extractmatch);
    });
  }

  if (verbose) write(join(process.cwd(), 'tmp/restored.md'), rendered);
  return rendered;
}
