const { join } = require('upath');
const typedocModule = require('typedoc');
const semver = require('semver');
const { default: git } = require('git-command-helper');
const { mkdirSync, existsSync } = require('fs');
const typedocOptions = require('./typedoc');
const gulp = require('gulp');
const pkgjson = require('./package.json');
const { spawn } = require('cross-spawn');

// required: npm i upath
// required: npm i -D semver typedoc git-command-helper gulp cross-spawn
// update: curl https://raw.githubusercontent.com/dimaslanjaka/static-blog-generator-hexo/master/packages/gulp-sbg/typedoc-runner.js > typedoc-runner.js
// repo: https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/packages/gulp-sbg/typedoc-runner.js

const REPO_URL = 'https://github.com/dimaslanjaka/docs.git';

/**
 * Compile typedocs
 */
const compile = async function () {
  const outDir = join(__dirname, 'docs');
  const projectDocsDir = join(outDir, pkgjson.name);

  if (!existsSync(outDir)) {
    spawn('git', ['clone', REPO_URL, 'docs'], { cwd: __dirname });
  }

  if (!existsSync(projectDocsDir)) mkdirSync(projectDocsDir, { recursive: true });
  const options = Object.assign({}, typedocOptions);

  const app = new typedocModule.Application();
  if (semver.gte(typedocModule.Application.VERSION, '0.16.1')) {
    app.options.addReader(new typedocModule.TSConfigReader());
    app.options.addReader(new typedocModule.TypeDocReader());
  }

  //console.log(options);
  //delete options.run;

  app.bootstrap(options);
  const project = app.convert();
  if (typeof project !== 'undefined') {
    await app.generateDocs(project, projectDocsDir);
    await app.generateJson(project, join(projectDocsDir, 'info.json'));
  } else {
    console.error('[error]', 'project undefined');
  }
};

/**
 * Compile and publish to github pages
 */
const publish = async function () {
  const outDir = join(__dirname, 'docs');
  if (!existsSync(join(outDir, '.git'))) mkdirSync(join(outDir, '.git'), { recursive: true });

  const github = new git(outDir);
  try {
    //await github.init();
    await github.setremote(REPO_URL);
    await github.setbranch('master');
    await github.reset('master');
  } catch {
    //
  }

  await compile();

  try {
    const commit = await new git(__dirname).latestCommit().catch(noop);
    const remote = (await new git(__dirname).getremote().catch(noop)).push.url.replace(/.git$/, '').trim();
    if (remote.length > 0) {
      console.log('current git project', remote);
      await github
        .addAndCommit(
          pkgjson.name,
          `${commit} update ${pkgjson.name} docs \nat ${new Date()}\nsource: ${remote}/commit/${commit}`
        )
        .catch(noop);
      if (await github.canPush().catch(noop)) {
        await github.push().catch(noop);
      }
    }
  } catch {
    //
  }
};

function noop(..._) {
  //
}

/**
 * Watch sources
 * @param {gulp.TaskFunctionCallback} done
 */
const watch = function (done) {
  const watcher = gulp.watch([join(__dirname, 'src/**/*')]);
  watcher.on('change', function (_event, filename) {
    console.log(filename);
  });
  watcher.on('close', done);
};

if (require.main === module) {
  (async () => {
    const argv = process.argv;
    // node typedoc-runner.js --publish
    if (argv.includes('--publish')) {
      console.log('[publish] start');
      await publish();
      console.log('[publish] finish');
    } else {
      console.log('[compile] start');
      await compile();
      console.log('[compile] finish');
    }
  })();
} else {
  //console.log('required as a module');
}

module.exports = publish;
module.exports = { run: publish, watch, compile };
