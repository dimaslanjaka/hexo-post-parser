process.env.DEBUG = '*';

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { getConfig, parsePost } from '../dist/index.mjs';
import parsedPostValidate from './parsePost-validator.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  //path.join(__dirname, 'src-posts/with-description.md'),
  //path.join(__dirname, 'src-posts/Tests/codeblock.md'),
  //path.join(__dirname, 'src-posts/Tests/unit/hello-world.md'),
  //path.join(__dirname, 'src-posts/Tests/unit/elements.md'),
  //path.join(__dirname, 'src-posts/Tests/unit/markdown.md'),
  //path.join(__dirname, 'src-posts/folder with space/file post with space.md'),
  //path.join(__dirname, 'src-posts/without-updated.md'),
  //path.join(__dirname, 'src-posts/without-date.md'),
  path.join(__dirname, 'src-posts/post-assets-folder/asset-folder.md'),
  path.join(__dirname, 'src-posts/with-custom-permalink.md')
  //'D:/Repositories/static-blog-generator/tests/src-posts/Tests/post-assets.md'
];

const config = getConfig();

files.forEach(async (file) => {
  if (fs.existsSync(file)) {
    parsedPostValidate(await parsePost(file, config));
    // test within subfolder
    parsedPostValidate(
      await parsePost(
        file,
        Object.assign({}, config, {
          url: 'https://www.webmanajemen.com/chimeraland',
          root: '/chimeraland/'
        })
      )
    );
  } else {
    console.log(`${file} not found`);
  }
});
