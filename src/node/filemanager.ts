import Bluebird from 'bluebird';
import fs from 'fs-extra';
import glob from 'glob';
import { default as nodePath } from 'path';
import { cwd as nodeCwd } from 'process';
import utility from 'sbg-utility';
import upath from 'upath';
type ErrnoException = NodeJS.ErrnoException;

/**
 * node_modules/.cache/${name}
 */
export const cacheDir = upath.join(process.cwd(), 'tmp/hexo-post-parser');
if (!fs.existsSync(upath.dirname(cacheDir)))
  fs.mkdirpSync(upath.dirname(cacheDir));

export type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};
const modPath = nodePath as Mutable<typeof nodePath>;
//modPath.sep = '/';

/**
 * Directory iterator recursive
 * @param dir
 * @param done
 */

const walk = function (
  dir: fs.PathLike,
  done: (err: ErrnoException | null, results?: string[]) => any
) {
  let results: string[] = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function (file) {
      file = modPath.resolve(dir.toString(), file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res || []);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

export type readDirectoryRecursivePromise = (
  files: string[] | ErrnoException
) => any;
export type readDirectoryRecursiveCb = (
  err: ErrnoException,
  results?: string[]
) => any;

export function readDirectoryRecursive(
  dirPath: string
): Bluebird<Parameters<readDirectoryRecursivePromise>[0]>;
export function readDirectoryRecursive(
  dirPath: string,
  callback?: readDirectoryRecursiveCb
) {
  if (typeof callback !== 'function') {
    return new Bluebird((res: readDirectoryRecursivePromise) => {
      walk(dirPath, function (err, files) {
        if (!err) {
          res(files);
        } else {
          res(err);
        }
      });
    });
  }
  return walk(dirPath, callback);
}

const filemanager = {
  readdirSync: readDirectoryRecursive,

  /**
   * Remove dir or file recursive synchronously (non-empty folders supported)
   * @param path
   */
  rmdirSync: (path: fs.PathLike, options: fs.RmOptions = {}) => {
    if (fs.existsSync(path))
      return fs.rmSync(path, Object.assign({ recursive: true }, options));
  },

  /**
   * remove dir or file recursive asynchronously
   * @param path
   * @param options
   * @param callback
   * @returns
   */
  rm: (
    path: fs.PathLike,
    options: fs.RmOptions | fs.NoParamCallback = {},
    callback?: fs.NoParamCallback
  ) => {
    if (fs.existsSync(path)) {
      fs.rm(path, Object.assign({ recursive: true }, options));
      if (typeof options == 'function') {
        options(null);
      } else if (typeof callback === 'function') {
        callback(null);
      }
    }
  },

  /**
   * Write to file recursively (synchronous)
   * @param path
   * @param content
   * @returns Promise.resolve(path);
   * @example
   * // write directly
   * const input = write('/folder/file.txt', {'a':'v'});
   * // log here
   * console.log('written successfully');
   * // or log using async
   * input.then((file)=> console.log('written to', file));
   */
  write: (path: fs.PathLike, content: any) => {
    const dir = modPath.dirname(path.toString());
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (typeof content != 'string') {
      if (typeof content == 'object') {
        content = utility.jsonStringifyWithCircularRefs(content);
      } else {
        content = String(content);
      }
    }
    fs.writeFileSync(path, content);
    return Bluebird.resolve(path);
  },

  /**
   * Make directory recursive default (only not exists dir)
   * @param path
   * @param options
   * @returns
   */
  mkdirSync: (path: fs.PathLike, options: fs.MakeDirectoryOptions = {}) => {
    if (!existsSync(path))
      return fs.mkdirSync(path, Object.assign({ recursive: true }, options));
  }
};

export function removeMultiSlashes(str: string) {
  return str.replace(/(\/)+/g, '$1');
}

export const globSrc = function (
  pattern: string,
  opts: glob.GlobOptionsWithFileTypesUnset = {}
) {
  return new Bluebird((resolve: (arg: string[]) => any, reject) => {
    const opt: glob.GlobOptionsWithFileTypesUnset = Object.assign(
      { cwd: cwd(), dot: true, matchBase: true },
      opts
    );
    glob
      .glob(pattern, opt)
      .then(function (files) {
        resolve(files.map(upath.toUnix));
      })
      .catch(reject);
  });
};

export default filemanager;
export const writeFileSync = filemanager.write;
export const cwd = () => upath.toUnix(nodeCwd());
export const dirname = (str: string) =>
  removeMultiSlashes(upath.toUnix(upath.dirname(str)));
interface ResolveOpt {
  [key: string]: any;
  /**
   * validate path exists, otherwise null
   */
  validate?: boolean;
}
/**
 * @see {@link upath.resolve}
 * @param str
 * @param opt
 * @returns
 */
export const resolve = (str: string, opt: ResolveOpt | any = {}) => {
  const res = removeMultiSlashes(upath.toUnix(upath.resolve(str)));
  opt = Object.assign(
    {
      validate: false
    },
    opt
  );
  if (opt.validate) {
    if (existsSync(res)) return res;
    return null;
  }
  return res;
};
/**
 * nullable read file synchronous
 * @param path
 * @param opt
 * @returns
 */
export function read(
  path: string,
  opt?: Parameters<typeof fs.readFileSync>[1]
) {
  if (existsSync(path)) return readFileSync(path, opt);
  return null;
}
/**
 * smart join to unix path
 * * removes empty/null/undefined
 * @param str
 * @returns
 */
export const join = upath.join;
export const { write, rmdirSync, rm, mkdirSync } = filemanager;
export const fsreadDirSync = fs.readdirSync;
export const { existsSync, readFileSync, appendFileSync, statSync } = fs;
export const { basename, relative, extname } = upath;
export const PATH_SEPARATOR = modPath.sep;
