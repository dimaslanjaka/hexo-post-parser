"use strict";
// noinspection DuplicatedCode
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const process_1 = __importDefault(require("process"));
const scheduler_1 = __importDefault(require("./scheduler"));
class spawner {
    /**
     * Spawn Commands
     * @param command node
     * @param args ['index.js']
     * @param callback callback for children process
     */
    // eslint-disable-next-line no-unused-vars
    static spawn(command, args, opt = {}, callback) {
        const defaultOption = { stdio: 'pipe', detached: false };
        if (['npm', 'ts-node', 'tsc', 'npx', 'hexo'].includes(command)) {
            command = /^win/.test(process_1.default.platform) ? `${command}.cmd` : command;
        }
        const child = (0, child_process_1.spawn)(command, args, Object.assign(defaultOption, opt));
        child.unref();
        child.stdout.setEncoding('utf8');
        child.stdout.on('data', function (data) {
            process_1.default.stdout.write(data);
        });
        child.stderr.setEncoding('utf8');
        child.stderr.on('data', function (data) {
            process_1.default.stdout.write(data);
        });
        child.stdin.on('data', function (data) {
            process_1.default.stdout.write(data);
        });
        if (typeof callback == 'function') {
            callback(child);
        }
        spawner.children.push(child);
        console.log(`Child Process ${spawner.children.length}`);
        if (!this.onExit) {
            scheduler_1.default.add('spawner', spawner.children_kill);
            /*this.onExit = true;
            console.log('registering children killer');
            process.on('exit', function () {
              console.log('Finished', new Date().getTime());
              spawner.children_kill();
            });
            process.on('uncaughtException', spawner.children_kill);
            process.on('SIGINT', spawner.children_kill);
            process.on('SIGTERM', spawner.children_kill);
            process.on('SIGKILL', spawner.children_kill);*/
        }
        return child;
    }
    /**
     * Kill all ChildProcessWithoutNullStreams[]
     */
    static children_kill() {
        console.log('killing', spawner.children.length, spawner.children.length > 1 ? 'child processes' : 'child process');
        for (let i = 0; i < spawner.children.length; i++) {
            const child = spawner.children[i];
            if (typeof child != 'undefined') {
                child.kill();
                console.log(`Child ${child.pid} killed ${child.killed}`);
                delete spawner.children[i];
            }
        }
    }
}
spawner.children = [];
spawner.onExit = false;
exports.default = spawner;
