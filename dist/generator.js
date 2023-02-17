"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = __importDefault(require("gulp"));
require("./gulp/tasks/copy");
require("./gulp/tasks/deploy");
require("./gulp/tasks/generate");
const cache_1 = require("./node/cache");
const filemanager_1 = require("./node/filemanager");
const scheduler_1 = __importDefault(require("./node/scheduler"));
const _config_1 = __importStar(require("./types/_config"));
// register scheduler
new scheduler_1.default();
/** clean generated folder */
const clean_public = (done) => (0, filemanager_1.rm)((0, filemanager_1.join)(_config_1.root, _config_1.default.public_dir), { recursive: true }, done);
/** clean posts from config.source_dir */
const clean_posts = (done) => (0, filemanager_1.rm)((0, filemanager_1.join)(_config_1.root, _config_1.default.source_dir, '_posts'), { recursive: true }, done);
/** clean temp folder */
const clean_tmp = (done) => (0, filemanager_1.rm)((0, _config_1.tmp)(), { recursive: true }, done);
/** clean database folder */
const clean_db = (done) => (0, filemanager_1.rm)(cache_1.dbFolder, { recursive: true }, done);
gulp_1.default.task('clean:public', clean_public);
gulp_1.default.task('clean:posts', clean_posts);
gulp_1.default.task('clean:db', clean_db);
gulp_1.default.task('clean:tmp', clean_tmp);
gulp_1.default.task('clean', gulp_1.default.parallel('clean:db', 'clean:tmp', 'clean:posts', 'clean:public'));
gulp_1.default.task('default', gulp_1.default.series('copy', 'generate'));
//# sourceMappingURL=generator.js.map