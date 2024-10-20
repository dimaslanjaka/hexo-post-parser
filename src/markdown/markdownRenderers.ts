import fs from 'fs-extra';
import MarkdownIt from 'markdown-it';
import MarkdownItAbbr from 'markdown-it-abbr';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItAttrs from 'markdown-it-attrs';
import MarkdownItFootnote from 'markdown-it-footnote';
import MarkdownItMark from 'markdown-it-mark';
import MarkdownItSub from 'markdown-it-sub';
import MarkdownItSup from 'markdown-it-sup';
import * as marked from 'marked';
import path from 'path';
import { md5 } from 'sbg-utility';
import showdown from 'showdown';
import slugify from '../node/slugify/index';

export const converterOpt = {
  strikethrough: true,
  tables: true,
  tablesHeaderId: true
};

/**
 * Generate a cache path based on function name and input string.
 *
 * @param functionName - The name of the function for cache separation.
 * @param str - The input string to generate a unique cache ID.
 * @returns The cache file path.
 */
function getCachePath(functionName: string, str: string): string {
  const cacheId = md5(str);
  return path.join(
    process.cwd(),
    'tmp/hexo-post-parser',
    functionName,
    `${cacheId}.json`
  );
}

/**
 * Write the cache content to a file.
 *
 * @param cachePath - The path where the cache should be stored.
 * @param content - The content to cache.
 */
function writeCache(cachePath: string, content: string): void {
  fs.ensureDirSync(path.dirname(cachePath));
  fs.writeFileSync(cachePath, content);
}

/**
 * Transform markdown string to HTML string using Showdown.
 *
 * @param str - The markdown string to convert.
 * @param cache - If true, caches the result in a temporary file.
 * @returns The rendered HTML content.
 */
export function renderShowdown(str: string, cache: boolean = false): string {
  let cachePath: string | undefined;

  if (cache === true) {
    cachePath = getCachePath('renderShowdown', str);
    if (fs.existsSync(cachePath)) {
      return fs.readFileSync(cachePath, 'utf8');
    }
  }

  const converter = new showdown.Converter(converterOpt);
  const result = converter.makeHtml(str);

  if (cachePath) {
    writeCache(cachePath, result);
  }

  return result;
}

/**
 * Render markdown to HTML using `markdown-it` with optional caching.
 *
 * @param str - The markdown string to render.
 * @param cache - If true, caches the result in a temporary file.
 * @returns The rendered HTML content.
 */
export function renderMarkdownIt(str: string, cache: boolean = false): string {
  let cachePath: string | undefined;

  if (cache === true) {
    cachePath = getCachePath('renderMarkdownIt', str);
    if (fs.existsSync(cachePath)) {
      return fs.readFileSync(cachePath, 'utf8');
    }
  }

  const md = new MarkdownIt('default', {
    html: true,
    linkify: false,
    typographer: true,
    breaks: false,
    langPrefix: 'language-'
  });

  md.use(MarkdownItSup)
    .use(MarkdownItSub)
    .use(MarkdownItMark)
    .use(MarkdownItAbbr)
    .use(MarkdownItFootnote)
    .use(MarkdownItAttrs, {
      allowedAttributes: ['id', 'class', /^regex.*$/]
    })
    .use(MarkdownItAnchor, {
      permalink: MarkdownItAnchor.permalink.headerLink(),
      slugify: (s: string) => slugify(s)
    });

  md.renderer.rules.footnote_block_open = () =>
    '<h4 class="mt-3">Footnotes</h4>\n' +
    '<section class="footnotes">\n' +
    '<ol class="footnotes-list">\n';

  const result = md.render(str, {});

  if (cachePath) {
    writeCache(cachePath, result);
  }

  return result;
}

/**
 * Renders a markdown string using Marked.js, with optional caching.
 *
 * @param str - The markdown string to render.
 * @param cache - If true, caches the result in a temporary file.
 * @returns The rendered HTML content.
 */
export function renderMarked(str: string, cache: boolean = false): string {
  let cachePath: string | undefined;

  if (cache === true) {
    cachePath = getCachePath('renderMarked', str);
    if (fs.existsSync(cachePath)) {
      return fs.readFileSync(cachePath, 'utf8');
    }
  }

  const result = marked.parse(str, { async: false });

  if (cachePath) {
    writeCache(cachePath, result);
  }

  return result;
}
