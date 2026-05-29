import color from 'ansi-colors';
import fs from 'fs-extra';
import { resolve } from 'path';
import {
  cacheDir,
  existsSync,
  join,
  readFileSync,
  rmdirSync
} from './filemanager';
import { md5 } from './md5-file';

type Func = (...args: any[]) => any;

class memoizer {
  cache = {};
  private functionKeys = new WeakMap<Func, string>();
  private functionKeySeed = 0;
  memoize = <F extends Func>(fn: F): F => {
    return ((...args: any[]) => {
      const find = this.getCacheFilePath(fn, ...args);

      if (existsSync(find)) {
        const read = JSON.parse(readFileSync(find, 'utf-8'));
        if (this.verbose) console.log(color.greenBright('Fetching from cache'));
        return this.resolveCachedValue(read);
      } else {
        if (this.verbose) console.log(color.redBright('Calculating result'));
        const result = fn(...args);
        fs.mkdirpSync(resolve(find, '..'));
        fs.writeFileSync(find, JSON.stringify(result));
        return result;
      }
    }) as F;
  };
  /**
   * @see {@link memoizer.memoize}
   */
  fn = this.memoize;
  /**
   * cache directory
   */
  cacheDir = join(cacheDir, 'memoize-fs');
  verbose = false;
  /**
   * determine function return type
   * @param arg
   * @returns
   */
  determineType(arg: any) {
    if (typeof arg == 'object') {
      if (Array.isArray(arg)) return 'array';
      return 'object';
    }
    return typeof arg;
  }
  /**
   * clear cache function
   * @param fn
   */
  clear(fn: Func, ...args: any[]) {
    const argpath = this.getCacheFilePath(fn, ...args);
    const fnpath = this.getCacheFilePath(fn);

    if (existsSync(fnpath)) {
      if (this.verbose) console.log('found fn');
      rmdirSync(fnpath);
    }
    if (existsSync(argpath)) {
      if (this.verbose) console.log('found fn args');
      rmdirSync(argpath);
    }
  }
  /**
   * get function cache file
   * @param fn
   * @param args
   * @returns
   */
  getCacheFilePath(fn: Func, ...args: any[]) {
    const args1 = String(args);
    return ((...args: any[]) => {
      let pathStr = this.determinefn(fn);
      if (args1.length) pathStr += '/' + md5(String(args1));
      if (args.length) pathStr += '/' + md5(String(args));
      const path = resolve(join(this.cacheDir, pathStr));
      if (this.verbose) console.log(path, existsSync(path));
      return path;
    })();
  }
  /**
   * determine function
   * @param fn
   * @param _args
   * @returns
   */
  private determinefn(fn: Func, ..._args: any[]) {
    const cachedKey = this.functionKeys.get(fn);
    if (cachedKey) return cachedKey;

    const fnStr = String(fn);
    const key = md5(`${++this.functionKeySeed}:${fnStr}`);
    this.functionKeys.set(fn, key);
    return key;
  }

  private resolveCachedValue(read: any) {
    if (read && typeof read == 'object' && 'content' in read) {
      return read.content;
    }
    return read;
  }
}
export default memoizer;

const mem = new memoizer();

export const memoizeFs = mem.memoize;
