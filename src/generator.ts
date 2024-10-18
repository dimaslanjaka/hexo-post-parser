import gulp from 'gulp';
import { scheduler } from 'sbg-utility';
import { TaskCallback } from 'undertaker';
import { dbFolder } from './node/cache';
import { join, rm } from './node/filemanager';
import { getConfig } from './types/_config';

// register scheduler
scheduler.register();

const config = () => getConfig();

/** clean generated folder */
const clean_public = (done?: TaskCallback) =>
  rm(join(config().root, config().public_dir), { recursive: true }, done);
/** clean posts from config.source_dir */
const clean_posts = (done?: TaskCallback) =>
  rm(
    join(config().root, config().source_dir, '_posts'),
    { recursive: true },
    done
  );
/** clean temp folder */
const clean_tmp = (done?: TaskCallback) =>
  rm(join(config().root, 'tmp'), { recursive: true }, done);
/** clean database folder */
const clean_db = (done?: TaskCallback) =>
  rm(dbFolder, { recursive: true }, done);

gulp.task('clean:public', clean_public);
gulp.task('clean:posts', clean_posts);
gulp.task('clean:db', clean_db);
gulp.task('clean:tmp', clean_tmp);
gulp.task(
  'clean',
  gulp.parallel('clean:db', 'clean:tmp', 'clean:posts', 'clean:public')
);
gulp.task('default', gulp.series('copy', 'generate'));
