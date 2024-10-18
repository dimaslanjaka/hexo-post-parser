import { isValidHttpUrl } from '../gulp/utils';

export function removeDoubleSlashes(str: string) {
  if (isValidHttpUrl(str)) return str.replace(/([^:]\/)\/+/g, '$1');
  return str.replace(/\/+/g, '/');
}

/**
 * count words boundary
 * @param str
 * @returns
 */
export function countWordsBoundary(str: string) {
  str = str.replace(/(^\s*)|(\s*$)/gi, '');
  str = str.replace(/[ ]{2,}/gi, ' ');
  str = str.replace(/\n /, '\n');
  return str.split(' ').length;
}

/**
 * Counts the number of words in a given string.
 * Non-alphanumeric characters (except spaces) are removed before counting.
 *
 * @param str - The input string to process.
 * @returns The number of words in the string.
 */
export function countWords(str: string): number {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove non-alphanumeric characters
    .trim()
    .split(/\s+/) // Split by whitespace
    .reduce((count, word) => (word ? count + 1 : count), 0); // Count non-empty items
}
