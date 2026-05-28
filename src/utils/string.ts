import { isValidHttpUrl } from '../gulp/utils';

export function removeDoubleSlashes(str: string) {
  if (isValidHttpUrl(str)) return str.replace(/([^:]\/)\/+/g, '$1');
  return str.replace(/\/+/g, '/');
}

/**
 * Counts words using simple space-boundary rules.
 *
 * Steps performed:
 * 1. Trim leading and trailing whitespace.
 * 2. Collapse multiple spaces into a single space.
 * 3. Normalize occurrences of `"\n "` to `"\n"`.
 * 4. Split the resulting string on a single space and return the number of tokens.
 *
 * Note: An empty or all-whitespace input returns `0`.
 *
 * @param str - The input string to count words from.
 * @returns The number of word tokens found using simple space boundary rules.
 */
export function countWordsBoundary(str: string) {
  str = str.replace(/(^\s*)|(\s*$)/gi, '');
  str = str.replace(/[ ]{2,}/gi, ' ');
  str = str.replace(/\n /, '\n');
  if (str.length === 0) return 0;
  return str.split(' ').length;
}

/**
 * Counts the number of words in a given string.
 *
 * This function removes non-alphanumeric characters (except whitespace), trims
 * the string, splits on any whitespace sequence and returns the number of
 * non-empty tokens.
 *
 * Examples:
 * - `countWords('Hello, world!')` -> `2`
 * - `countWords('')` -> `0`
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
