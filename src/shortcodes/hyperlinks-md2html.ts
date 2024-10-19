import ansiColors from 'ansi-colors';
import { getConfig } from '../types/_config';
// fix all hyperlinks endsWith .md
// [test](test.md) -> [test](test.html)
const regex = /\[([^\]]+)\]\(([^)]+(.md))\)/gim;
const logname = ansiColors.blueBright('[replaceMD2HTML]');

/**
 * Replace hyperlinks endswith .md with .html
 * @param content body string
 * @returns
 */
export function replaceMD2HTML(content: string) {
  const config = getConfig();
  const { verbose } = config.generator;
  if (content.match(regex)) {
    content = content.replace(
      regex,
      function (wholeMatch, _index1, index2, index3) {
        // act here or after the loop...
        //console.log(index2, index3);
        const toReplace = index2;
        const replacement = index2.replace(new RegExp(index3 + '$'), '.html');
        if (verbose)
          console.log(
            logname,
            ansiColors.redBright(toReplace),
            '->',
            ansiColors.greenBright(replacement)
          );
        //return wholeMatch.replace(index3, '.html');
        return wholeMatch.replace(toReplace, replacement);
      }
    );
  }
  return content;
}

export default replaceMD2HTML;
