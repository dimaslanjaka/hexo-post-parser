import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { dirname, join, toUnix } from 'upath';
import { verbose } from '../types/_config';

const root = toUnix(process.cwd());
const logname = chalk.blue('[include]');

/**
 * Process `shortcode include` to included in file, shortcode below:
 * ```html
 * <!-- include file.ext -->
 * ```
 * @param file
 * @param str
 * @returns
 */
export function parseShortCodeInclude(file: string, str: string) {
  const regex = /<!--\s+?include\s+?(.+?)\s+?-->/gim;
  const execs = Array.from(str.matchAll(regex));
  if (execs.length) {
    execs.forEach((m) => {
      const htmlTag = m[0];
      const includefile = m[1];
      const dirs = {
        directFile: join(dirname(file.toString()), includefile),
        //cwdFile: join(cwd(), includefile),
        rootFile: join(root, includefile)
      };
      for (const key in dirs) {
        if (Object.prototype.hasOwnProperty.call(dirs, key)) {
          const filepath = dirs[key];
          if (existsSync(filepath)) {
            if (verbose)
              console.log(logname + chalk.greenBright(`[${key}]`), file);
            const read = readFileSync(filepath).toString();
            str = str.replace(htmlTag, () => read);
            break;
          }
        }
      }
    });
  }
  return str;
}
export default parseShortCodeInclude;
