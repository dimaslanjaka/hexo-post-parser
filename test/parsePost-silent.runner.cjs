const path = require('path');
const glob = require('glob');
const hpp = require('../dist/index.cjs');
const utility = require('sbg-utility');

const config = hpp.getConfig();

const parse = async (file) => {
  const result = await hpp.parsePost(file, {
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
  const output = path.join(
    __dirname,
    'tmp/test/parsePost/',
    path.basename(file)
  );
  console.log(output);
  utility.writefile(output, hpp.buildPost(result));
  const resultSub = await hpp.parsePost(
    file,
    Object.assign({}, config, {
      url: 'https://www.webmanajemen.com/chimeraland',
      root: '/chimeraland/'
    })
  );
  const outputSub = path.join(
    __dirname,
    'tmp/test/parsePost/',
    'sub-' + path.basename(file)
  );
  console.log(outputSub);
  utility.writefile(outputSub, hpp.buildPost(resultSub));
  return result;
};

const files = glob.globSync('./src-posts/**/*.md', {
  cwd: __dirname,
  absolute: true
});
files.map(parse);
