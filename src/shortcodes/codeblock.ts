import axios from 'axios';
import { trim } from 'lodash';
import { join } from 'upath';
import cache from 'persistent-cache';
import jdom from '../node/jsdom';
import { md5 } from '../node/md5-file';
import { replaceArr } from '../node/utils';
import config from '../types/_config';

const dom = new jdom();
const _cache = cache({
  base: join(process.cwd(), 'tmp/persistent-cache'), //join(process.cwd(), 'node_modules/.cache/persistent'),
  name: 'shortcode/codeblock',
  duration: 1000 * 3600 * 24 // 24 hours
});

export async function shortcodeCodeblock(str: string) {
  const regex =
    /(\{% codeblock (.*?) %\}|\{% codeblock %\})((.*?|\n)+?)(\{% endcodeblock %\})/gim;
  let m: RegExpExecArray;

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    const codeblock = m[0];
    const openingTag = m[1];
    const closingTag = m[5];
    const args = m[2];
    const content = m[3];
    if (!args) {
      const plain = replaceArr(
        codeblock,
        [openingTag, closingTag],
        [
          '<pre><code><!-- prettier-ignore-start -->',
          '<!-- prettier-ignore-end --></code></pre>'
        ]
      );
      str = str.replace(codeblock, plain);
    } else {
      const build = [];
      const splitArgs = args.split(/\s/).map(trim);
      // get title codeblock
      const title =
        typeof splitArgs[0] == 'string' && !splitArgs[0].startsWith('lang:')
          ? splitArgs[0]
          : null;

      if (typeof title == 'string' && title.length > 0) {
        build.push(`<span>${title}</span>`);
      }

      // get url page title codeblock
      const url = splitArgs
        .filter((s) => {
          try {
            new URL(s);
            return s.match(/^(https|ftps|ssh|git*)?:\/\//);
          } catch (error) {
            return false;
          }
        })
        .filter((s) => typeof s == 'string' && s.length > 0);

      let urlTitle: string | null | undefined;
      if (url.length > 0) {
        // cache key
        const cacheKey = md5(url[0]);
        // get cache otherwise null
        urlTitle = _cache.getSync(cacheKey);

        if (url[0].match(/^https?:\/\//) && !urlTitle) {
          try {
            const res = await axios.get(url[0]);
            if (res.status === 200) {
              const doc = dom.parse(res.data);
              // assign url page title
              urlTitle = doc.title.trim();
              // close dom, avoid memory leaks
              dom.close();
              // set cache
              _cache.putSync(cacheKey, urlTitle);
              if (config.verbose)
                console.log('resolved codeblock url', urlTitle);
            } else {
              throw new Error('Response status not !== 200');
            }
          } catch (error) {
            if (config.verbose) {
              if (error instanceof Error) console.log(error.message);
              console.log('cannot resolve', url);
            }
          }
        }
        if (typeof urlTitle == 'string') {
          build.push(
            `<a target="_blank" rel="noopener external nofollow noreferrer" href="${url[0]}">${urlTitle}</a>`
          );
        }
      }

      // get language type codeblock
      const langs = splitArgs
        .filter((s) => {
          return s.startsWith('lang:');
        })
        .map((s) => {
          return s.split(':')[1];
        });
      let codeblockBuild = '';
      if (
        (typeof title == 'string' && title.length > 0) ||
        (typeof urlTitle == 'string' && urlTitle.length > 0)
      ) {
        codeblockBuild += `<figure class="highlight plain"><figcaption>${build.join(
          ''
        )}</figcaption>`;
      }

      if (langs.length > 0) {
        const lang = langs[0];
        codeblockBuild += `<pre class="highlight language-${lang}"><code><!-- prettier-ignore-start -->${content}<!-- prettier-ignore-end --></code></pre></figure>`;
      } else {
        codeblockBuild += `<pre><code><!-- prettier-ignore-start -->${content}<!-- prettier-ignore-end --></code></pre></figure>`;
      }
      str = str.replace(codeblock, codeblockBuild);
    }
  }
  return str;
}
