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
const upath_1 = require("upath");
const buildPost_1 = __importDefault(require("./buildPost"));
const postMapper_1 = require("./markdown/transformPosts/postMapper");
const color_1 = __importDefault(require("./node/color"));
const filemanager_1 = require("./node/filemanager");
const sanitize_filename_1 = require("./node/sanitize-filename");
const parsePost_1 = __importDefault(require("./parsePost"));
const _config_1 = require("./types/_config");
const config = (0, _config_1.getConfig)();
const tmpDir = (0, upath_1.join)(__dirname, '../tmp');
if ((0, fs_1.existsSync)(tmpDir))
    (0, fs_1.rmSync)(tmpDir, { recursive: true, force: true });
const files = [
    //join(__dirname, '../src-posts/with-description.md'),
    //join(__dirname, '../src-posts/Tests/codeblock.md'),
    //join(__dirname, '../src-posts/Tests/unit/hello-world.md'),
    //join(__dirname, '../src-posts/Tests/unit/elements.md'),
    //join(__dirname, '../src-posts/Tests/unit/markdown.md'),
    //join(__dirname, '../src-posts/folder with space/file post with space.md'),
    //join(__dirname, '../src-posts/without-updated.md'),
    //join(__dirname, '../src-posts/without-date.md'),
    (0, upath_1.join)(__dirname, '../src-posts/post-assets-folder/asset-folder.md'),
    (0, upath_1.join)(__dirname, '../src-posts/with-custom-permalink.md')
    //'D:/Repositories/static-blog-generator/tests/src-posts/Tests/post-assets.md'
];
files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, fs_1.existsSync)(file)) {
        yield startParse(file, config);
        // test within subfolder
        yield startParse(file, Object.assign({}, config, {
            url: 'https://www.webmanajemen.com/chimeraland',
            root: '/chimeraland/'
        }));
    }
    else {
        console.log(`${file} not found`);
    }
}));
function startParse(file, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const parse = yield (0, parsePost_1.default)(file, {
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
            sourceFile: file,
            config: config
        });
        if (parse && parse.metadata) {
            const filename = parse.metadata.title;
            const mdFile = yield (0, filemanager_1.write)((0, upath_1.join)(__dirname, '../tmp/test/parsePost', config.root, (0, sanitize_filename_1.slugifySanitizeFilename)(filename) + '.md'), (0, buildPost_1.default)(parse));
            const jsonFile = yield (0, filemanager_1.write)((0, upath_1.join)(__dirname, '../tmp/test/parsePost', config.root, (0, sanitize_filename_1.slugifySanitizeFilename)(filename) + '.json'), (0, postMapper_1.simplifyDump)(parse));
            console.log(color_1.default.green('success parse'), [jsonFile, mdFile]);
        }
        else {
            console.log(color_1.default.redBright('fail parse'), file);
        }
    });
}
//# sourceMappingURL=parsePost.test.js.map