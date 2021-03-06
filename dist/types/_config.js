"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.post_source_dir = exports.post_generated_dir = exports.nocache = exports.verbose = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const process_1 = require("process");
const upath_1 = require("upath");
const yaml_1 = tslib_1.__importDefault(require("yaml"));
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const argv = (0, yargs_1.default)(process.argv.slice(2)).argv;
const nocache = argv['nocache'];
exports.nocache = nocache;
const verbose = argv['verbose'];
exports.verbose = verbose;
const defaultOptions = {
    // Site
    title: 'Hexo',
    subtitle: '',
    description: '',
    author: 'John Doe',
    language: 'en',
    timezone: '',
    // URL
    url: 'http://example.com',
    root: '/',
    permalink: ':year/:month/:day/:title/',
    permalink_defaults: {},
    pretty_urls: {
        trailing_index: true,
        trailing_html: true
    },
    // Directory
    source_dir: 'source',
    public_dir: 'public',
    tag_dir: 'tags',
    archive_dir: 'archives',
    category_dir: 'categories',
    code_dir: 'downloads/code',
    i18n_dir: ':lang',
    skip_render: [],
    // Mapper
    title_map: {},
    tag_map: {},
    category_map: {},
    tag_group: {},
    category_group: {},
    // Writing
    new_post_name: ':title.md',
    default_layout: 'post',
    titlecase: false,
    external_link: {
        enable: true,
        field: 'site',
        exclude: ''
    },
    filename_case: 0,
    render_drafts: false,
    post_asset_folder: false,
    relative_link: false,
    future: true,
    highlight: {
        enable: true,
        auto_detect: false,
        line_number: true,
        tab_replace: '',
        wrap: true,
        exclude_languages: [],
        hljs: false
    },
    prismjs: {
        enable: false,
        preprocess: true,
        line_number: true,
        tab_replace: ''
    },
    // Category & Tag
    default_category: 'uncategorized',
    default_tag: null,
    // Date / Time format
    date_format: 'YYYY-MM-DD',
    time_format: 'HH:mm:ss',
    updated_option: 'mtime',
    // * mtime: file modification date (default)
    // * date: use_date_for_updated
    // * empty: no more update
    // Pagination
    per_page: 10,
    pagination_dir: 'page',
    // Extensions
    theme: 'landscape',
    server: {
        cache: false
    },
    // Deployment
    deploy: {},
    // ignore files from processing
    ignore: [],
    // Category & Tag
    meta_generator: true
};
let config = defaultOptions;
// find _config.yml
const file = (0, upath_1.join)(process.cwd(), '_config.yml');
if ((0, fs_1.existsSync)(file)) {
    const readConfig = (0, fs_1.readFileSync)(file, 'utf-8');
    const parse = yaml_1.default.parse(readConfig);
    config = Object.assign(defaultOptions, parse, {
        verbose,
        generator: {
            cache: !nocache
        }
    });
}
(0, fs_1.writeFileSync)((0, upath_1.join)(__dirname, '_config_project.json'), JSON.stringify(config, null, 2));
exports.default = config;
/**
 * Hexo Generated Dir
 */
exports.post_generated_dir = (0, upath_1.join)((0, process_1.cwd)(), config.public_dir);
/**
 * SBG Source Post Dir
 */
exports.post_source_dir = (0, upath_1.join)((0, process_1.cwd)(), 'src-posts');
//# sourceMappingURL=_config.js.map