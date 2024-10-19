import ansiColors from 'ansi-colors';
import fs from 'fs';
import path from 'upath';
import { fileURLToPath } from 'url';
import buildPost from '../src/buildPost';
import { simplifyDump } from '../src/markdown/postMapper';
import { write } from '../src/node/filemanager';
import { slugifySanitizeFilename } from '../src/node/sanitize-filename';
import parsePost from '../src/parsePost';
import { getConfig } from '../src/types/_config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = getConfig();
const tmpDir = path.join(__dirname, '../tmp');
if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });

const files = [
  path.join(__dirname, 'src-posts/post-assets-folder/asset-folder.md'),
  path.join(__dirname, 'src-posts/with-custom-permalink.md')
];

files.forEach(async (file) => {
  if (fs.existsSync(file)) {
    await startParse(file, config);
    // test within subfolder
    await startParse(
      file,
      Object.assign({}, config, {
        url: 'https://www.webmanajemen.com/chimeraland',
        root: '/chimeraland/'
      })
    );
  } else {
    console.log(`${file} not found`);
  }
});

async function startParse(file: string, config: Record<string, any>) {
  const parse = await parsePost(file, {
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
    config: <any>config
  });
  if (parse && parse.metadata) {
    const filename = parse.metadata.title;
    const mdFile = await write(
      path.join(
        __dirname,
        '../tmp/test/parsePost',
        config.root,
        slugifySanitizeFilename(filename) + '.md'
      ),
      buildPost(parse)
    );

    const jsonFile = await write(
      path.join(
        __dirname,
        '../tmp/test/parsePost',
        config.root,
        slugifySanitizeFilename(filename) + '.json'
      ),
      simplifyDump(parse)
    );

    console.log(ansiColors.green('success parse'), [jsonFile, mdFile]);
  } else {
    console.log(ansiColors.redBright('fail parse'), file);
  }
}
