import {
  existsSync,
  mkdirSync,
  PathLike,
  readdirSync,
  writeFileSync
} from 'fs';
import { minimatch } from 'minimatch';
import { basename, join } from 'upath';
import { parsePost } from '../src';
import buildPost from '../src/buildPost';
import { getConfig, SiteConfig } from '../src/types/_config';

// dump posts to tmp/test

const config = getConfig();

const files = walkSync(join(__dirname, '../test/src-posts')).filter((path) => {
  const haveExclusion = config.skip_render.some((pattern) =>
    minimatch(path, pattern, { matchBase: true, dot: true })
  );
  //if (path.includes('README')) console.log(have, path);
  return path.endsWith('.md') && !haveExclusion;
});
const tmp = join(__dirname, '../tmp/test');
if (!existsSync(tmp)) mkdirSync(tmp, { recursive: true });

// parse single sample post
//_singleParse(join(process.cwd(), 'src-posts/Tests/index.md'));
// bulk parse
_bulkParse();

function _singleParse(postPath = join(__dirname, 'test/index.md')) {
  const parseSingle = runParser(postPath);
  console.log(parseSingle);
}

function _bulkParse() {
  // parse all posts on ../src-posts
  for (const filePath of files) {
    runParser(filePath);
  }
}

async function runParser(filePath: string) {
  const parse = await parsePost(filePath, {
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
    bodyPath: join(tmp, basename(filePath, '.md') + '.body.md'),
    buildPath: join(tmp, basename(filePath, '.md') + '.md'),
    jsonPath: join(tmp, basename(filePath, '.md') + '.json')
  };
  // write body
  writeFileSync(resultPaths.bodyPath, parse.body);
  // rebuild post with processed shortcodes
  writeFileSync(resultPaths.buildPath, buildPost(parse));

  // remove anoying properties for easy to read
  parse.body = 'body';
  parse.content = 'body';
  parse.config = {} as SiteConfig;

  // write parsed object to json
  writeFileSync(resultPaths.jsonPath, JSON.stringify(parse, null, 2));
  return resultPaths;
}

/**
 * Iterate Files Recusively From Directory
 * @see {@link https://stackoverflow.com/a/66083078/6404439}
 * @param dir dir path
 */
function walkSync(dir: PathLike) {
  const files = readdirSync(dir, { withFileTypes: true });
  let results: string[] = [];
  for (const file of files) {
    if (file.isDirectory()) {
      results = results.concat(walkSync(join(dir, file.name)));
    } else {
      results.push(join(dir, file.name));
    }
  }
  return results;
}
