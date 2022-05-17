import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'upath';
import yaml from 'yaml';
import data from './_config_project.json';

const def = {
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
  category_map: {},
  tag_map: {},
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

type MergeData = Partial<typeof data> & Partial<typeof def>;
interface Config extends Partial<MergeData> {
  amp?: any;
  default_tag?: string;
  default_category?: string;
  content?: string;
}

let config = def;

// find _config.yml
const file = join(process.cwd(), '_config.yml');
if (existsSync(file)) {
  const readConfig = readFileSync(file, 'utf-8');
  const parse = yaml.parse(readConfig);
  config = Object.assign(def, parse);
}

writeFileSync(join(__dirname, '_config_project.json'), JSON.stringify(config));

export default config as Config;
