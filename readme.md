# JS Parse FrontMatter Markdown Post

<div id="shields" align="center">
  
[![Build Release](https://github.com/dimaslanjaka/hexo-post-parser/actions/workflows/build-release.yml/badge.svg)](https://github.com/dimaslanjaka/hexo-post-parser/actions/workflows/build-release.yml?label=Stars&color=gold&logo=github&logoColor=white&labelColor=464646&style=for-the-badge)
[![Build Site](https://github.com/dimaslanjaka/static-blog-generator-hexo/actions/workflows/build-site.yml/badge.svg)](https://github.com/dimaslanjaka/static-blog-generator-hexo/actions/workflows/build-site.yml?label=Stars&color=gold&logo=github&logoColor=white&labelColor=464646&style=for-the-badge)

</div>

Parse **FrontMatter Markdown** Posts To Javascript Object

- [READ FULL EXAMPLE](https://github.com/dimaslanjaka/hexo-post-parser/tree/master/tests)
- [Typescript Source Code](https://github.com/dimaslanjaka/hexo-post-parser/tree/master/src)
- [AUTO LINTER](https://www.webmanajemen.com/NodeJS/eslint-prettier-typescript-vscode.html)
- [API DOCUMENTATIONS](https://www.webmanajemen.com/docs/hexo-post-parser/modules.html)

## Features
- Parsing HexoJS markdown post
- Parsing Jekyll markdown post
- Parsing Hugo markdown post
- Parsing Frontmatter markdown
- Post Asset Folder Auto Fix for HexoJS
- Parse shortcodes - ([Show all Shortcodes](#shortcodes))
- Include partials files with html comments
- Get all images from post body and push them to metadata.photos
- Auto find meta description when not set

## Pre-Requirements
- Node v18+

## Installation

from npm registry

```bash
npm i hexo-post-parser # yarn add hexo-post-parser
```

from github master branch [see commit history](https://github.com/dimaslanjaka/hexo-shortcodes/commits/master)

```bash
npm i hexo-post-parser@https://github.com/dimaslanjaka/hexo-post-parser/tarball/COMMIT_HASH
```

from github pre-release branch [see commit history](https://github.com/dimaslanjaka/hexo-shortcodes/commits/pre-release)

```bash
npm i hexo-post-parser@https://github.com/dimaslanjaka/hexo-post-parser/raw/COMMIT_HASH/release/hexo-post-parser.tgz
```

> for **yarn** just replace `npm i` to `yarn add`

## Configuration needed
- file `_config.yml`

```yaml
url: "https://domain.com/"
root: "/"
permalink: ":year/:month/:title.html"
generator:
  type: 'hexo' # or jekyll
  cache: true # enable caching
  verbose: false # enable verbose
  amp: false # transform shortcodes to amp html
```

parse post overriden options
```typescript
const { parsePost } = require('hexo-post-parser');
const filePath = '/path/to/file.md';
parsePost(filePath, {
  shortcodes: {
    youtube: true,
    css: true,
    include: true,
    link: true,
    now: true,
    script: true,
    text: true,
    codeblock: true
  },
  config: {
    generator: {
      cache: false,
      verbose: false,
      amp: false,
      type: 'hexo'
    }
  },
  formatDate: true,
  fix: true,
  sourceFile: filePath
})
```

## Shortcodes

| Shortcode | Description |
| :--- | :--- |
| `<!-- include folder/path.txt -->` | Include partial files |
| `<!-- script folder/script.js -->` | Include JS file as html script `<script>codes</script>` |
| `{% youtube video_id %}` | transform youtube tag (AMP Supported) |

## Usage Sample

- [Usages with GULP](https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/packages/gulp-sbg/src/gulp.post.ts)

```js
const fs = require('fs');
(async function(){
  const { parsePost, buildPost } = require('hexo-post-parser');
  const parse = await parsePost('path/to/markdown/file.md');
  // dump parsed post to json
  fs.writeFileSync('path/to/file.json', JSON.stringify(parse, null, 2));
  // build parsed post
  fs.writeFileSync('path/to/file.md', buildPost(parse));
})();
```

## Project Sample
[https://github.com/dimaslanjaka/static-blog-generator-hexo](https://github.com/dimaslanjaka/static-blog-generator-hexo)

[https://github.com/dimaslanjaka/chimeraland](https://github.com/dimaslanjaka/chimeraland)

deployed to: [www.webmanajemen.com](https://www.webmanajemen.com)

## Argument Parameters
- `--nocache` : disable cache
- `--verbose` : show all console on verbose

## Reference Repositories
- [Static Blog Generator](https://github.com/dimaslanjaka/static-blog-generator)

## Contribute
build compiled js to `dist` folder
```bash
yarn run build
```
build tarball in `release` folder
```bash
yarn run pack
```
