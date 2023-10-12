import hljs, { AutoHighlightResult, HighlightResult } from 'highlight.js';
import { re_code_block } from './renderBodyMarkdown';

/**
 * render markdown code block to highlight.js html parsed
 * @param content
 * @returns
 */
export default function renderCodeblock(content: string) {
  if (re_code_block.test(content)) {
    content.match(re_code_block).forEach((str) => {
      const parsed = str.replace(re_code_block, function (_whole, lang, inner) {
        let parse: HighlightResult | AutoHighlightResult;
        let result: string;
        if (inner) {
          lang = lang.trim();
          parse = hljs.highlight(inner, { language: lang });
          result = `<pre><code class="hljs language-${lang}">${parse.value}</code></pre>`;
        } else {
          parse = hljs.highlightAuto(lang, ['js', 'css', 'html']);
          result = `<pre><code class="hljs">${parse.value}</code></pre>`;
        }

        return result;
      });
      content = content.replace(str, parsed);
      // let m: RegExpExecArray;
      // while ((m = re_code_block.exec(str)) !== null) {
      //   let code: string, language: string;
      //   if (m.length === 2) {
      //     code = m[1].trim();
      //   } else if (m.length === 3) {
      //     language = m[1].trim();
      //     code = m[2].trim();
      //   }
      //   const toHtml = language
      //     ? hljs.highlight(code, { language })
      //     : hljs.highlightAuto(code, ['js', 'html', 'css']);
      //   console.log(toHtml.value);
      // }
    });
  }
  return content;
}
