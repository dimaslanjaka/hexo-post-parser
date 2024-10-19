import ansiColors from 'ansi-colors';
import fs from 'fs-extra';
import path from 'path';
import { writefile } from 'sbg-utility';
import buildPost from '../buildPost';
import { existsSync } from '../node/filemanager';
import { postMap } from '../types';

/**
 * Save Parsed Hexo markdown post
 * @param parsed return {@link parsePost}
 * @param file file path to save
 */
export function saveParsedPost(parsed: postMap, file: string) {
  if (!existsSync(path.dirname(file))) fs.ensureDirSync(path.dirname(file));
  writefile(file, buildPost(parsed));
}

/**
 * validate {@link parsePost}
 * @param parse
 * @returns
 */
export const validateParsed = (parse: postMap) => {
  if (parse === null) return false;
  if (typeof parse === 'undefined') return false;
  if (parse && !parse.body) {
    console.log(ansiColors['Red Orange']('body of null:'));
    return false;
  }
  return true;
};
