import ansiColors from 'ansi-colors';
import fs from 'fs-extra';
import lodash from 'lodash';
import utility, { scheduler } from 'sbg-utility';
import { TypedEmitter } from 'tiny-typed-emitter';
import upath from 'upath';
import { DynamicObject } from '../types';
import {
  cacheDir,
  existsSync,
  join,
  mkdirSync,
  read,
  resolve,
  write
} from './filemanager';
import logger from './logger';
import { md5, md5FileSync } from './md5-file';
import memoizer from './memoize-fs';

/**
 * default folder to save databases
 */
export const dbFolder = upath.toUnix(resolve(cacheDir));

export interface CacheOpt {
  /**
   * immediately save cache value
   * * default false
   */
  sync?: boolean;
  /**
   * root/folder to save entire databases
   * * default node_modules/.cache/dimaslanjaka
   */
  folder?: string;
}

/**
 * @default
 */
export type ResovableValue = {
  /**
   * resolve all `cache value` instead `value location file`, default `true`
   */
  resolveValue?: boolean;
  /**
   * max result, default null
   */
  max?: number;
  /**
   * randomize entries, default false
   */
  randomize?: boolean;
};
export const defaultResovableValue: ResovableValue = {
  resolveValue: true,
  max: null,
  randomize: false
};

interface CacheFileEvent {
  update: () => void;
}

/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
export default class CacheFile extends TypedEmitter<CacheFileEvent> {
  getInstance() {
    return this;
  }
  private total = 0;
  getTotal() {
    this.total = Object.keys(this.md5Cache).length;
    return this.total;
  }
  /**
   * memoizer persistent file
   * * cached function result for reusable
   * @see {@link memoizer}
   */
  static memoizer = new memoizer();
  md5Cache: DynamicObject = {};
  dbFile: string;
  static options: CacheOpt = {
    sync: false,
    folder: dbFolder
  };
  private currentHash: string;
  constructor(hash: string = null, opt?: CacheOpt) {
    super();
    if (opt) CacheFile.options = Object.assign(CacheFile.options, opt);
    this.currentHash = hash;
    if (!hash) {
      const stack = new Error().stack.split('at')[2];
      hash = md5(stack);
    }
    if (!existsSync(CacheFile.options.folder))
      mkdirSync(CacheFile.options.folder);
    this.dbFile = join(CacheFile.options.folder, 'db-' + hash);
    if (!existsSync(this.dbFile)) write(this.dbFile, {});
    let db = read(this.dbFile, 'utf-8');
    if (typeof db == 'string') {
      try {
        db = JSON.parse(db.toString());
      } catch (_e) {
        logger.log('cache database lost');
        //logger.log(e);
      }
    }
    if (typeof db == 'object') {
      this.md5Cache = db;
    }
  }

  /**
   * clear cache
   * @returns
   */
  clear() {
    return new Promise((resolve: (arg: Array<Error>) => any) => {
      const opt = { recursive: true, retryDelay: 3000, maxRetries: 3 };
      // delete current hash folders
      fs.rm(join(CacheFile.options.folder, this.currentHash), opt, (e) => {
        // delete current hash db
        fs.rm(this.dbFile, opt, (ee) => {
          resolve([e, ee]);
        });
      });
    });
  }

  /**
   * @see {@link CacheFile.set}
   * @param key
   * @param value
   * @returns
   */
  setCache = (key: string, value: any) => this.set(key, value);
  /**
   * resolve long text on key
   */
  resolveKey(key: string) {
    // if key is file path
    if (existsSync(key)) return key;
    // if key is long text
    if (key.length > 32) {
      // search post id
      const regex =
        /id:.*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gm;
      const m = regex.exec(key);
      if (m && typeof m[1] == 'string') return m[1];
      // return first 32 byte text
      return md5(key.substring(0, 32));
    }
    return key;
  }
  /**
   * locate ${CacheFile.options.folder}/${currentHash}/${unique key hash}
   * @param key
   * @returns
   */
  locateKey = (key: string) =>
    join(CacheFile.options.folder, this.currentHash, md5(this.resolveKey(key)));
  dump(key?: string) {
    if (key) {
      return {
        resolveKey: this.resolveKey(key),
        locateKey: this.locateKey(key),
        db: this.dbFile
      };
    }
  }
  set(key: string, value: any): CacheFile {
    const self = this;
    // resolve key hash
    key = this.resolveKey(key);
    // locate key location file
    const locationCache = this.locateKey(key);
    // +key value
    this.md5Cache[key] = locationCache;

    // save cache on process exit
    scheduler.add('writeCacheFile-' + this.currentHash, () => {
      logger.log(
        ansiColors.magentaBright(self.currentHash),
        'saved cache',
        self.dbFile
      );
      write(self.dbFile, utility.jsonStringifyWithCircularRefs(self.md5Cache));
    });
    if (value)
      write(locationCache, utility.jsonStringifyWithCircularRefs(value));
    this.emit('update');
    return this;
  }
  /**
   * check cache key exist
   * @param key key cache
   * @returns boolean
   */
  has(key: string): boolean {
    key = this.resolveKey(key);
    return Object.hasOwnProperty.call(this.md5Cache, key) && this.md5Cache[key];
  }
  /**
   * Get cache by key
   * @param key
   * @param fallback
   * @returns
   */
  get(key: string, fallback: any = null) {
    // resolve key hash
    key = this.resolveKey(key);
    if (!key) throw new Error(`cannot resolve key (${key})`);

    // locate key location file
    const locationCache = this.locateKey(key);
    const Get = this.md5Cache[key];
    if (!Get) return fallback;
    if (existsSync(locationCache)) {
      try {
        return JSON.parse(String(read(locationCache, 'utf-8')));
      } catch (e) {
        console.log('cannot get cache key', key);
        throw e;
      }
    }
    return fallback;
  }
  getCache = (key: string, fallback: any = null) => this.get(key, fallback);
  /**
   * get all databases
   * @param opt Options
   * @returns object keys and values
   */
  getAll(opt = defaultResovableValue) {
    opt = Object.assign(defaultResovableValue, opt);
    if (opt.resolveValue) {
      const self = this;
      const result: DynamicObject = {};
      Object.keys(this.md5Cache).forEach((key) => {
        result[key] = self.get(key);
      });
      return result;
    }
    return this.md5Cache;
  }

  /**
   * get all database values
   * @param opt Options
   * @returns array values
   */
  getValues<T = any>(opt = defaultResovableValue) {
    opt = Object.assign(defaultResovableValue, opt);
    if (opt.resolveValue) {
      const result: T[] = [];
      const self = this;
      Object.keys(this.md5Cache).forEach((key) => {
        result.push(self.get(key));
      });

      if (opt.randomize) return lodash.shuffle(result);
      if (opt.max) {
        result.length = opt.max;
        return result.splice(0, opt.max);
      }
      return result;
    }
    return Object.values(this.md5Cache) as T[];
  }
  /**
   * Check file is changed with md5 algorithm
   * @param path0
   * @returns
   */
  isFileChanged(path0: string): boolean {
    if (typeof path0 != 'string') {
      //console.log("", typeof path0, path0);
      return true;
    }
    try {
      // get md5 hash from path0
      const pathMd5 = md5FileSync(path0);
      // get index hash
      const savedMd5 = this.md5Cache[path0 + '-hash'];
      const result = savedMd5 != pathMd5;
      if (result) {
        // set, if file hash is not found
        this.md5Cache[path0 + '-hash'] = pathMd5;
      }
      return result;
    } catch (_e) {
      return true;
    }
  }
}
