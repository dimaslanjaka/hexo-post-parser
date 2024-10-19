import ansiColors from 'ansi-colors';
import fs from 'fs-extra';
import upath from 'upath';
import { getConfig } from '../types/_config';

const root = upath.toUnix(process.cwd());
const logname = ansiColors.blue('[include]');

/**
 * Process `shortcode include` to included in file, shortcode below:
 * ```html
 * <!-- include file.ext -->
 * ```
 * @param sourceFile
 * @param bodyString
 * @returns
 */
export function parseShortCodeInclude(sourceFile: string, bodyString: string) {
  const config = getConfig();
  const { verbose } = config.generator;
  const regex = /<!--\s+?include\s+?(.+?)\s+?-->/gim;
  let modified = false;
  let execs = Array.from(bodyString.matchAll(regex));
  while (execs.length > 0) {
    for (let i = 0; i < execs.length; i++) {
      const match = execs.shift();

      const htmlTag = match[0];
      const includefile = match[1];
      const dirs: Record<string, string> = {
        directFile: upath.join(
          upath.dirname(sourceFile.toString()),
          includefile
        ),
        //cwdFile: join(cwd(), includefile),
        rootFile: upath.join(root, includefile)
      };
      dirs.assetFolder = upath.join(
        sourceFile.replace(/.md$/, ''),
        includefile
      );

      for (const key in dirs) {
        if (Object.prototype.hasOwnProperty.call(dirs, key)) {
          const filepath = dirs[key];
          if (fs.existsSync(filepath)) {
            if (verbose) {
              console.log(
                logname + ansiColors.greenBright(`[${key}]`),
                sourceFile
              );
            }
            const read = fs.readFileSync(filepath).toString();
            bodyString = bodyString.replace(htmlTag, () => read);
            execs = Array.from(bodyString.matchAll(regex));
            modified = true;
            break;
          }
        }
      }
    }
  }
  // @todo include nested shortcodes when modified occurs
  if (regex.test(bodyString) && modified) {
    return parseShortCodeInclude(sourceFile, bodyString);
  }
  return bodyString;
}
export default parseShortCodeInclude;
