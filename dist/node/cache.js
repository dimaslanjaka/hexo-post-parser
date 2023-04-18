"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultResovableValue = exports.dbFolder = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const lodash_1 = __importDefault(require("lodash"));
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const upath_1 = require("upath");
require("./cache-serialize");
const filemanager_1 = require("./filemanager");
const JSON_1 = require("./JSON");
const logger_1 = __importDefault(require("./logger"));
const md5_file_1 = require("./md5-file");
const memoize_fs_1 = __importDefault(require("./memoize-fs"));
const scheduler_1 = __importDefault(require("./scheduler"));
/**
 * default folder to save databases
 */
exports.dbFolder = (0, upath_1.toUnix)((0, filemanager_1.resolve)(filemanager_1.cacheDir));
exports.defaultResovableValue = {
    resolveValue: true,
    max: null,
    randomize: false
};
/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
class CacheFile extends tiny_typed_emitter_1.TypedEmitter {
    getInstance() {
        return this;
    }
    getTotal() {
        this.total = Object.keys(this.md5Cache).length;
        return this.total;
    }
    constructor(hash = null, opt) {
        super();
        this.total = 0;
        this.md5Cache = {};
        /**
         * @see {@link CacheFile.set}
         * @param key
         * @param value
         * @returns
         */
        this.setCache = (key, value) => this.set(key, value);
        /**
         * locate ${CacheFile.options.folder}/${currentHash}/${unique key hash}
         * @param key
         * @returns
         */
        this.locateKey = (key) => (0, filemanager_1.join)(CacheFile.options.folder, this.currentHash, (0, md5_file_1.md5)(this.resolveKey(key)));
        this.getCache = (key, fallback = null) => this.get(key, fallback);
        if (opt)
            CacheFile.options = Object.assign(CacheFile.options, opt);
        this.currentHash = hash;
        if (!hash) {
            const stack = new Error().stack.split('at')[2];
            hash = (0, md5_file_1.md5)(stack);
        }
        if (!(0, filemanager_1.existsSync)(CacheFile.options.folder))
            (0, filemanager_1.mkdirSync)(CacheFile.options.folder);
        this.dbFile = (0, filemanager_1.join)(CacheFile.options.folder, 'db-' + hash);
        if (!(0, filemanager_1.existsSync)(this.dbFile))
            (0, filemanager_1.write)(this.dbFile, {});
        let db = (0, filemanager_1.read)(this.dbFile, 'utf-8');
        if (typeof db == 'string') {
            try {
                db = JSON.parse(db.toString());
            }
            catch (e) {
                logger_1.default.log('cache database lost');
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
        return new Promise((resolve) => {
            const opt = { recursive: true, retryDelay: 3000, maxRetries: 3 };
            // delete current hash folders
            (0, fs_1.rm)((0, filemanager_1.join)(CacheFile.options.folder, this.currentHash), opt, (e) => {
                // delete current hash db
                (0, fs_1.rm)(this.dbFile, opt, (ee) => {
                    resolve([e, ee]);
                });
            });
        });
    }
    /**
     * resolve long text on key
     */
    resolveKey(key) {
        // if key is file path
        if ((0, filemanager_1.existsSync)(key))
            return key;
        // if key is long text
        if (key.length > 32) {
            // search post id
            const regex = /id:.*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gm;
            const m = regex.exec(key);
            if (m && typeof m[1] == 'string')
                return m[1];
            // return first 32 byte text
            return (0, md5_file_1.md5)(key.substring(0, 32));
        }
        return key;
    }
    dump(key) {
        if (key) {
            return {
                resolveKey: this.resolveKey(key),
                locateKey: this.locateKey(key),
                db: this.dbFile
            };
        }
    }
    set(key, value) {
        const self = this;
        // resolve key hash
        key = this.resolveKey(key);
        // locate key location file
        const locationCache = this.locateKey(key);
        // +key value
        this.md5Cache[key] = locationCache;
        // save cache on process exit
        scheduler_1.default.add('writeCacheFile-' + this.currentHash, () => {
            logger_1.default.log(chalk_1.default.magentaBright(self.currentHash), 'saved cache', self.dbFile);
            (0, filemanager_1.write)(self.dbFile, (0, JSON_1.json_encode)(self.md5Cache));
        });
        if (value)
            (0, filemanager_1.write)(locationCache, (0, JSON_1.json_encode)(value));
        this.emit('update');
        return this;
    }
    /**
     * check cache key exist
     * @param key key cache
     * @returns boolean
     */
    has(key) {
        key = this.resolveKey(key);
        return Object.hasOwnProperty.call(this.md5Cache, key) && this.md5Cache[key];
    }
    /**
     * Get cache by key
     * @param key
     * @param fallback
     * @returns
     */
    get(key, fallback = null) {
        // resolve key hash
        key = this.resolveKey(key);
        if (!key)
            throw new Error(`cannot resolve key (${key})`);
        // locate key location file
        const locationCache = this.locateKey(key);
        const Get = this.md5Cache[key];
        if (!Get)
            return fallback;
        if ((0, filemanager_1.existsSync)(locationCache)) {
            try {
                return JSON.parse(String((0, filemanager_1.read)(locationCache, 'utf-8')));
            }
            catch (e) {
                console.log('cannot get cache key', key);
                throw e;
            }
        }
        return fallback;
    }
    /**
     * get all databases
     * @param opt Options
     * @returns object keys and values
     */
    getAll(opt = exports.defaultResovableValue) {
        opt = Object.assign(exports.defaultResovableValue, opt);
        if (opt.resolveValue) {
            const self = this;
            const result = {};
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
    getValues(opt = exports.defaultResovableValue) {
        opt = Object.assign(exports.defaultResovableValue, opt);
        if (opt.resolveValue) {
            const result = [];
            const self = this;
            Object.keys(this.md5Cache).forEach((key) => {
                result.push(self.get(key));
            });
            if (opt.randomize)
                return lodash_1.default.shuffle(result);
            if (opt.max) {
                result.length = opt.max;
                return result.splice(0, opt.max);
            }
            return result;
        }
        return Object.values(this.md5Cache);
    }
    /**
     * Check file is changed with md5 algorithm
     * @param path0
     * @returns
     */
    isFileChanged(path0) {
        if (typeof path0 != 'string') {
            //console.log("", typeof path0, path0);
            return true;
        }
        try {
            // get md5 hash from path0
            const pathMd5 = (0, md5_file_1.md5FileSync)(path0);
            // get index hash
            const savedMd5 = this.md5Cache[path0 + '-hash'];
            const result = savedMd5 != pathMd5;
            if (result) {
                // set, if file hash is not found
                this.md5Cache[path0 + '-hash'] = pathMd5;
            }
            return result;
        }
        catch (e) {
            return true;
        }
    }
}
/**
 * memoizer persistent file
 * * cached function result for reusable
 * @see {@link memoizer}
 */
CacheFile.memoizer = new memoize_fs_1.default();
CacheFile.options = {
    sync: false,
    folder: exports.dbFolder
};
exports.default = CacheFile;
//# sourceMappingURL=cache.js.map