import { scheduler } from 'sbg-utility';
import { TaskCallback } from 'undertaker';
import { dbFolder } from './node/cache';
import { join, rm } from './node/filemanager';
import { getConfig } from './types/_config';

// register scheduler
scheduler.register();

const config = () => getConfig();

/** clean generated folder */
export const clean_public = (done?: TaskCallback) =>
  rm(join(config().root, config().public_dir), { recursive: true }, done);
/** clean posts from config.source_dir */
export const clean_posts = (done?: TaskCallback) =>
  rm(
    join(config().root, config().source_dir, '_posts'),
    { recursive: true },
    done
  );
/** clean temp folder */
export const clean_tmp = (done?: TaskCallback) =>
  rm(join(config().root, 'tmp'), { recursive: true }, done);
/** clean database folder */
export const clean_db = (done?: TaskCallback) =>
  rm(dbFolder, { recursive: true }, done);
