"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const upath_1 = __importDefault(require("upath"));
const process_1 = __importDefault(require("process"));
const spawner_1 = __importDefault(require("./spawner"));
const md5_file_1 = require("./md5-file");
const uuid_1 = require("./uuid");
const tempFolder = process_1.default.cwd() + '/tmp/compiler';
if (fs_1.default.existsSync(tempFolder)) {
    fs_1.default.unlinkSync(upath_1.default.join(process_1.default.cwd(), tempFolder));
}
class process {
    /**
     * Kill All Node Processes
     */
    static killNode() {
        if (this.isWin) {
            //taskkill /f /im node.exe
        }
        else {
            //killall node
        }
    }
    /**
     * Create lock file
     * @param file
     */
    static lockCreate(file) {
        return upath_1.default.join(process_1.default.cwd(), this.tmp, (0, md5_file_1.md5FileSync)(file));
    }
    /**
     * do process
     * @param lockfile
     * @param options
     * @param callback
     */
    static doProcess(lockfile, options, callback) {
        if (typeof options.verbose == 'boolean') {
            this.verbose = options.verbose;
        }
        lockfile = process.lockCreate(lockfile);
        if (fs_1.default.existsSync(lockfile)) {
            console.log(`Process locked (${lockfile}). please provide unique ids.`);
            return null;
        }
        const doCall = function () {
            if (typeof callback == 'function') {
                return callback(lockfile);
            }
            else if (typeof options == 'function') {
                return options(lockfile);
            }
        };
        process.lockProcess(lockfile);
        // eslint-disable-next-line no-unused-vars
        const load = new Promise((resolve, _reject) => {
            doCall();
            resolve(true);
        });
        load.then(function () {
            process.releaseLock(lockfile);
        });
    }
    /**
     * lock the process
     * @param lockfile
     */
    static lockProcess(lockfile) {
        if (this.verbose) {
            console.log('locking process');
        }
        if (!upath_1.default.resolve(upath_1.default.dirname(lockfile))) {
            fs_1.default.mkdirSync(upath_1.default.dirname(lockfile), { recursive: true });
        }
        fs_1.default.writeFileSync(lockfile, 'lockfile');
    }
    /**
     * release lock process
     * @param lockfile
     */
    static releaseLock(lockfile) {
        if (this.verbose) {
            console.log('releasing process');
        }
        if (fs_1.default.existsSync(lockfile)) {
            fs_1.default.unlinkSync(lockfile);
        }
        else {
            if (this.verbose) {
                console.error('process file already deleted');
            }
        }
    }
}
/**
 * Root terminal
 */
process.root = process_1.default.cwd();
/**
 * Debug
 */
process.verbose = false;
/**
 * Compiler temp folder
 */
process.tmp = tempFolder;
/**
 * Current process unique id
 */
process.id = (0, uuid_1.makeid)(5, '_');
/**
 * process instance `import coreProcess from "process";`
 */
process.core = process_1.default;
process.isWin = process_1.default.platform === 'win32';
process.spawner = spawner_1.default;
exports.default = process;
