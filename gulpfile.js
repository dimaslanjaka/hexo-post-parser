import { spawn } from 'git-command-helper/dist/spawn';
import gulp from 'gulp';
import { join } from 'path';
import { publish } from './typedoc-runner.js';

gulp.task('docs', function (done) {
  publish({ cleanOutputDir: false }, () => done());
});

gulp.task('build', function () {
  return spawn('yarn', ['build'], {
    cwd: new URL('.', import.meta.url).pathname
  });
});

gulp.task('watch', function () {
  return gulp.series('build')(() =>
    gulp.watch(
      '**/*.*',
      { cwd: join(new URL('.', import.meta.url).pathname, 'src') },
      gulp.series('build')
    )
  );
});
