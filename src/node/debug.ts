import debugLib from 'debug';

/**
 * debug log
 * @param name
 * @returns
 */
export default function debug(name: string) {
  return debugLib(name);
}
