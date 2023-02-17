"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const minimatch_1 = __importDefault(require("minimatch"));
const upath_1 = require("upath");
const _1 = require(".");
const buildPost_1 = __importDefault(require("./buildPost"));
const _config_1 = require("./types/_config");
const config = (0, _config_1.getConfig)();
const files = walkSync((0, upath_1.join)(__dirname, '../src-posts')).filter((path) => {
    const haveExclusion = config.skip_render.some((pattern) => (0, minimatch_1.default)(path, pattern, { matchBase: true, dot: true }));
    //if (path.includes('README')) console.log(have, path);
    return path.endsWith('.md') && !haveExclusion;
});
const tmp = (0, upath_1.join)(__dirname, '../tmp/test');
if (!(0, fs_1.existsSync)(tmp))
    (0, fs_1.mkdirSync)(tmp, { recursive: true });
// parse single sample post
//_singleParse(join(process.cwd(), 'src-posts/Tests/index.md'));
// bulk parse
_bulkParse();
function _singleParse(postPath = (0, upath_1.join)(__dirname, 'test/index.md')) {
    const parseSingle = runParser(postPath);
    console.log(parseSingle);
}
function _bulkParse() {
    // parse all posts on ../src-posts
    for (const filePath of files) {
        runParser(filePath);
    }
}
function runParser(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const parse = yield (0, _1.parsePost)(filePath, {
            formatDate: true,
            shortcodes: {
                youtube: true,
                include: true,
                css: true,
                script: true,
                link: true,
                text: true,
                now: true,
                codeblock: true
            },
            cache: false,
            fix: true,
            sourceFile: filePath
        });
        if (!parse) {
            console.log(`fail parse ${filePath}`);
            return;
        }
        const resultPaths = {
            bodyPath: (0, upath_1.join)(tmp, (0, upath_1.basename)(filePath, '.md') + '.body.md'),
            buildPath: (0, upath_1.join)(tmp, (0, upath_1.basename)(filePath, '.md') + '.md'),
            jsonPath: (0, upath_1.join)(tmp, (0, upath_1.basename)(filePath, '.md') + '.json')
        };
        // write body
        (0, fs_1.writeFileSync)(resultPaths.bodyPath, parse.body);
        // rebuild post with processed shortcodes
        (0, fs_1.writeFileSync)(resultPaths.buildPath, (0, buildPost_1.default)(parse));
        // remove anoying properties for easy to read
        parse.body = 'body';
        parse.content = 'body';
        parse.config = {};
        // write parsed object to json
        (0, fs_1.writeFileSync)(resultPaths.jsonPath, JSON.stringify(parse, null, 2));
        return resultPaths;
    });
}
/**
 * Iterate Files Recusively From Directory
 * @see {@link https://stackoverflow.com/a/66083078/6404439}
 * @param dir dir path
 */
function walkSync(dir) {
    const files = (0, fs_1.readdirSync)(dir, { withFileTypes: true });
    let results = [];
    for (const file of files) {
        if (file.isDirectory()) {
            results = results.concat(walkSync((0, upath_1.join)(dir, file.name)));
        }
        else {
            results.push((0, upath_1.join)(dir, file.name));
        }
    }
    return results;
}
//# sourceMappingURL=index.test.js.map