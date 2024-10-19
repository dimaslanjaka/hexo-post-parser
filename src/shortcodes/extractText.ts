import ansiColors from 'ansi-colors';
import fs from 'fs-extra';
import path from 'path';
import { getConfig } from '../types/_config';

const logname = ansiColors.bgMagenta.whiteBright('[extract-text]');

export function extractText(file: string, str: string) {
  const config = getConfig();
  const regex = /<!--\s+?extract-text\s+?(.+?)\s+?-->/gim;
  let m: RegExpExecArray;
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    const allmatch = m[0];
    const bracketmatch = m[1];
    //console.info(logname, allmatch, bracketmatch);

    // search from file directory
    const directFile = path.join(path.dirname(file.toString()), bracketmatch);
    if (fs.existsSync(directFile)) {
      if (config.generator.verbose)
        console.info(
          `${logname} found from direct ${directFile.replace(
            process.cwd() + '/',
            ''
          )}`
        );
      const directRead = fs.readFileSync(directFile).toString();
      str = str.replace(allmatch, directRead);
    } else {
      // search from workspace directory
      if (config.generator.verbose) {
        console.info(
          `${logname} found from workspace ${directFile.replace(
            process.cwd() + '/',
            ''
          )}`
        );
      }
      const rootFile = path.join(process.cwd(), bracketmatch);
      if (fs.existsSync(rootFile)) {
        const rootRead = fs.readFileSync(rootFile).toString();
        str = str.replace(allmatch, () => rootRead);
      }
    }
  }
  return str;
}
export default extractText;
