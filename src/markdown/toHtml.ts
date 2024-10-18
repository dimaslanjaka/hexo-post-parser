import fs from 'fs-extra';
import MarkdownIt from 'markdown-it';
import MarkdownItAbbr from 'markdown-it-abbr';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItAttrs from 'markdown-it-attrs';
import MarkdownItFootnote from 'markdown-it-footnote';
import MarkdownItMark from 'markdown-it-mark';
import MarkdownItSub from 'markdown-it-sub';
import MarkdownItSup from 'markdown-it-sup';
import marked from 'marked';
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
 * Transform markdown string to html string
 * @package showdown
 * @param str
 */
export default function renderShowdown(str: string) {
  const converter = new showdown.Converter(converterOpt);
  return converter.makeHtml(str);
}

const md = new MarkdownIt('default', {
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
export function renderMarkdownIt(str: string) {
  const cacheId = md5(str);
  const cachePath = path.join(
    process.cwd(),
    'tmp/hexo-post-parser',
    'renderMarkdownIt',
    cacheId + 'json'
  );
  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath).toString();
  }
  const result = md.render(str, {});
  fs.ensureDirSync(path.dirname(cachePath));
  fs.writeFileSync(cachePath, result);
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
  let cachePath = '';

  if (cache) {
    const cacheId = md5(str);
    cachePath = path.join(
      process.cwd(),
      'tmp/hexo-post-parser',
      'renderMarkdownIt',
      `${cacheId}.json`
    );
    if (fs.existsSync(cachePath)) {
      return fs.readFileSync(cachePath, 'utf8');
    }
  }

  const result = marked.parse(str, { async: false });
  if (cache) {
    fs.ensureDirSync(path.dirname(cachePath));
    fs.writeFileSync(cachePath, result);
  }

  return result;
}
