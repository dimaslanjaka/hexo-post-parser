import ansiColors from 'ansi-colors';
import fs from 'fs-extra';
import upath from 'upath';
import { getConfig } from '../types/_config';

const root = upath.toUnix(process.cwd());
const logname = ansiColors.blue('[css]');

/**
 * Parse shortcode css
 * ```html
 * <!-- css /path/file.css -->
 * ```
 * @param file file path
 * @param str body content
 * @returns
 */
export function shortcodeCss(file: string, str: string) {
  const config = getConfig();
  const log = [logname];
  const regex = /<!--\s+?css\s+?(.+?)\s+?-->/gim;
  const execs = Array.from(str.matchAll(regex));
  execs.forEach((m) => {
    const htmlTag = m[0];
    const includefile = m[1];
    const dirs = {
      directFile: upath.join(upath.dirname(file.toString()), includefile),
      //cwdFile: join(cwd(), includefile),
      rootFile: upath.join(root, includefile)
    };
    for (const key in dirs) {
      if (Object.prototype.hasOwnProperty.call(dirs, key)) {
        const filepath = (dirs as Record<string, any>)[key] as string;
        if (fs.existsSync(filepath)) {
          if (config.generator.verbose) {
            console.log(...log, ansiColors.greenBright(`[${key}]`), file);
          }
          const read = fs.readFileSync(filepath, 'utf-8');
          str = str.replace(htmlTag, () => `<style>${read}</style>`);
          //console.log('match tag', str.match(new RegExp(htmlTag, 'm'))[0]);
          //write(tmp('shortcode', 'script.txt'), mod).then(console.log);
          break;
        }
      }
    }
  });
  return str;
}
