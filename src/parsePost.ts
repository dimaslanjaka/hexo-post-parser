import color from 'ansi-colors';
import debug from 'debug';
import { deepmerge } from 'deepmerge-ts';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import path from 'path';
import {
  array_unique,
  jsonStringifyWithCircularRefs,
  normalizePathUnix,
  persistentCache,
  writefile
} from 'sbg-utility';
import upath from 'upath';
import yaml from 'yaml';
import { generatePostId } from './generatePostId';
import { isValidHttpUrl } from './gulp/utils';
import { renderMarked } from './markdown/markdownRenderers';
import uniqueArray, { uniqueStringArray } from './node/array-unique';
import { md5, md5FileSync } from './node/md5-file';
import sanitizeFilename from './node/sanitize-filename';
import { cleanString, cleanWhiteSpace, replaceArr } from './node/utils';
import { moment, parseDateMapper } from './parseDateMapper';
import { parsePostFM } from './parsePost-front-matter';
import { shortcodeCodeblock } from './shortcodes/codeblock';
import { shortcodeCss } from './shortcodes/css';
import { extractText } from './shortcodes/extractText';
import { replaceMD2HTML } from './shortcodes/hyperlinks-md2html';
import { parseShortCodeInclude } from './shortcodes/include';
import { shortcodeScript } from './shortcodes/script';
import { shortcodeNow } from './shortcodes/time';
import { shortcodeYoutube } from './shortcodes/youtube';
import { Nullable, ParseOptions, postMap, postMeta } from './types';
import { getConfig, post_generated_dir, setConfig } from './types/_config';
import { sortObjectByKeys } from './utils/object';
import { countWords, removeDoubleSlashes } from './utils/string';

const log = debug('hexo-post-parser').extend('parsePost');
let _cache: persistentCache;

/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return {@link postMap} metadata {string & object} and body
 * * return {@link null} == failed
 * @param target file path or string markdown contents (used for cache key)
 * @param options options parser
 * * {@link ParseOptions.sourceFile} used for cache key when `target` is file contents
 */
export async function parsePost(target: string, options: ParseOptions = {}) {
  if (!target) return null;
  const tmpDir = upath.join(process.cwd(), 'tmp/hexo-post-parser');
  if (!_cache) {
    _cache = new persistentCache({
      base: tmpDir, //join(process.cwd(), 'node_modules/.cache/persistent'),
      name: 'parsePost',
      duration: 1000 * 3600 * 24 // 24 hours
    });
  }
  const default_options: ParseOptions = {
    shortcodes: {
      css: false,
      script: false,
      include: false,
      youtube: false,
      link: false,
      text: false,
      now: false,
      codeblock: false
    },
    sourceFile: null,
    formatDate: false,
    config: getConfig(),
    cache: false,
    fix: false,
    defaultThumb:
      'https://rawcdn.githack.com/dimaslanjaka/public-source/6a0117ddb2ea327c80dbcc7327cceca1e1b7794e/images/no-image-svgrepo-com.svg'
  };
  if (options.config) {
    options.config = deepmerge(default_options.config, options.config);
  }
  options = Object.assign(default_options, options);

  const siteConfig = options.config ? setConfig(options.config) : getConfig();
  if (!options.sourceFile && fs.existsSync(target)) options.sourceFile = target;

  const fileTarget = options.sourceFile || target;
  const cacheKey = fs.existsSync(fileTarget)
    ? md5FileSync(fileTarget)
    : md5(fileTarget);
  if (options.cache) {
    // log('use cache');
    const getCache = _cache.getSync<postMap>(cacheKey);
    if (getCache) return getCache;
  } else {
    // log('fresh cache');
  }

  /**
   * source file if variable `text` is file
   */
  let originalFile = target;
  const isFile = fs.existsSync(target) && fs.statSync(target).isFile();
  // log(target, 'is file', isFile);
  if (isFile) {
    target = String(fs.readFileSync(target, 'utf-8'));
    if (options.sourceFile) originalFile = options.sourceFile;
  }

  const processParsed = async (
    body: Nullable<string>,
    metadata: Record<string, any>
  ) => {
    let meta: postMap['metadata'] = {
      title: '',
      subtitle: '',
      date: '',
      tags: [],
      categories: []
    };
    meta = Object.assign(meta, metadata);

    const rawbody = body; // raw body

    // add custom body
    if (!body) body = 'no content ' + (meta.title || '');

    if (!meta.id) {
      // assign post id
      meta.id = generatePostId(meta);
    }

    // @todo set default date post
    if (!meta.date) {
      meta.date = moment(new Date()).format('YYYY-MM-DDTHH:mm:ssZ');
    }
    if (meta.modified && !meta.updated) {
      meta.updated = moment(meta.modified).format('YYYY-MM-DDTHH:mm:ssZ');
    }
    if (!meta.updated) {
      if (meta.modified) {
        // fix for hexo-blogger-xml
        meta.updated = meta.modified;
        delete meta.modified;
      } else {
        // @todo metadata date modified based on date published
        const str = String(meta.date);
        let date: Date = str.trim().length > 0 ? new Date(str) : new Date();
        if (/\d{4}-\d-\d{2}/.test(str)) {
          date = new Date(str);
        }
        meta.updated = moment(date).format('YYYY-MM-DDTHH:mm:ssZ');
      }
    } else {
      if (meta.modified) {
        // fix for hexo-blogger-xml
        delete meta.modified;
      }
    }

    if (options.fix) {
      /*
      // change date modified based on file modified date
      if (isFile) {
        const sourceFile = toUnix(originalArg);
        if (existsSync(sourceFile)) {
          if (!meta.updated) {
            const stats = statSync(sourceFile);
            const mtime = stats.mtime;
            meta.updated = moment(mtime).format('YYYY-MM-DDTHH:mm:ssZ');
          }
        }
      }
      */

      // @todo fix meta language
      const lang = meta.lang || meta.language;
      if (!lang) {
        meta.lang = 'en';
        //meta.language = 'en';
      }
    }

    // @todo fix meta.category to meta.categories
    if (meta.category) {
      if (!meta.categories || meta.categories.length === 0) {
        meta.categories = meta.category;
      } else if (Array.isArray(meta.category)) {
        meta.categories = meta.categories.concat(...meta.category);
      }

      // delete meta.category
      delete meta.category;
    }

    // @todo set default category and tags
    if (!meta.categories) meta.categories = [];
    if (options.config.default_category && !meta.categories.length)
      meta.categories.push(options.config.default_category);
    if (!meta.tags) meta.tags = [];
    if (options.config.default_tag && !meta.tags.length)
      meta.tags.push(options.config.default_tag);

    // @todo fix thumbnail
    if (options.fix) {
      const thumbnail = meta.cover || meta.thumbnail || options.defaultThumb;
      if (typeof thumbnail === 'string' && thumbnail.trim().length > 0) {
        if (!meta.thumbnail) meta.thumbnail = thumbnail;
        if (!meta.cover) meta.cover = thumbnail;
        if (!meta.photos) {
          meta.photos = [];
        }
        meta.photos.push(meta.cover);
      }
      if (Array.isArray(meta.photos)) {
        const photos: string[] = meta.photos.filter(
          (str) => typeof str === 'string' && str.trim().length > 0
        );
        meta.photos = uniqueArray(photos);
      }
    }

    // @todo fix post author
    if (options.fix) {
      const author = meta.author || options.config.author;
      if (!meta.author && author) {
        meta.author = author;
      }
    }

    // @todo set default enable comments
    if (typeof meta.comments == 'undefined' || meta.comments == null)
      meta.comments = true;
    // @todo set default wordcount to 0
    if (!meta.wordcount) meta.wordcount = 0;

    // @todo set default excerpt/description
    if (meta.subtitle) {
      // check if meta.subtitle exist
      meta.excerpt = meta.subtitle;
      meta.description = meta.subtitle;
    } else if (meta.description && !meta.excerpt) {
      // check if meta.description exist
      meta.subtitle = meta.description;
      meta.excerpt = meta.description;
    } else if (meta.excerpt && !meta.description) {
      // check if meta.excerpt exist
      meta.description = meta.excerpt;
      meta.subtitle = meta.excerpt;
    } else {
      // const bodyHtml = renderMarkdownIt(body);
      const bodyHtml = renderMarked(body, options.cache);
      const dom = new JSDOM(bodyHtml);
      // @todo fix no meta description
      const tags = Array.from(
        dom.window.document.body.getElementsByTagName('*')
      );
      const newExcerpt = [meta.title]
        .concat(uniqueArray(tags.map((el) => el.textContent?.trim())))
        .flat()
        .join(' ')
        .substring(0, 300);
      meta.description = newExcerpt;
      meta.subtitle = newExcerpt;
      meta.excerpt = newExcerpt;
    }

    // @todo count words when wordcount is 0
    if (
      meta.wordcount === 0 &&
      typeof body === 'string' &&
      body.trim().length > 0
    ) {
      const words = body;
      meta.wordcount = countWords(words);
    }

    // @todo fix description
    if (options.fix) {
      // fix empty title
      if (typeof meta.title !== 'string' || meta.title.trim().length === 0) {
        meta.title = path.basename(options.sourceFile);
      }
      // fix special char in metadata
      meta.title = cleanString(meta.title);
      meta.subtitle = cleanWhiteSpace(cleanString(meta.subtitle));
      meta.excerpt = cleanWhiteSpace(cleanString(meta.excerpt));
      meta.description = cleanWhiteSpace(cleanString(meta.description));
    }

    // @todo fix default category and tags
    if (options.fix) {
      // remove uncategorized if programming category pushed
      if (options.config.default_category)
        if (
          meta.categories.includes(options.config.default_category) &&
          meta.categories.length > 1
        ) {
          meta.categories = meta.categories.filter(
            (e) => e !== options.config.default_category
          );
        }
      // @todo remove untagged if programming category pushed
      if (options.config.default_tag)
        if (
          meta.tags.includes(options.config.default_tag) &&
          meta.tags.length > 1
        ) {
          meta.tags = meta.tags.filter((e) => e !== options.config.default_tag);
        }
    }

    // @todo remove duplicated metadata photos
    if (
      options.fix &&
      'photos' in meta &&
      Array.isArray(meta.photos) &&
      meta.photos.length > 0
    ) {
      try {
        meta.photos = uniqueStringArray(
          meta.photos.filter((str) => str.trim().length > 0)
        );
      } catch (e: any) {
        console.error('cannot unique photos', meta.title, e.message);
      }
    }

    // @todo delete location
    if (
      Object.prototype.hasOwnProperty.call(meta, 'location') &&
      !meta.location
    ) {
      delete meta.location;
    }

    if (isFile || options.sourceFile) {
      let publicFile: string;
      if (isFile) {
        publicFile = normalizePathUnix(originalFile);
      } else if (options.sourceFile) {
        publicFile = normalizePathUnix(options.sourceFile);
      } else {
        throw new Error('cannot find public file of ' + meta.title);
      }
      /**
       * Post Asset Fixer
       * @param sourcePath
       * @returns
       */
      const post_assets_fixer = (sourcePath: string): string => {
        const logname = color.blueBright('[PAF]');
        if (!publicFile) return sourcePath;

        // Replace extended title from source
        sourcePath = sourcePath.replace(/['"](.*)['"]/gim, '').trim();

        // Return original source path for http(s) URLs or specific patterns
        if (
          /^https?:\/\//.test(sourcePath) ||
          /^(\$|#|data:image)/.test(sourcePath)
        ) {
          return sourcePath;
        }

        // Prepend http for protocol-relative URLs
        if (sourcePath.startsWith('//')) {
          sourcePath = 'http:' + sourcePath;
        }

        // Decode URL if it contains encoded spaces
        if (sourcePath.includes('%20')) {
          sourcePath = decodeURIComponent(sourcePath);
        }

        // Handle invalid HTTP URLs and non-root paths
        if (!isValidHttpUrl(sourcePath)) {
          // Skip file exist in folder _config.yml.source_dir
          if (
            fs.existsSync(
              normalizePathUnix(
                process.cwd(),
                options.config.source_dir,
                sourcePath
              )
            )
          ) {
            return sourcePath;
          }
          const potentialPaths = array_unique([
            normalizePathUnix(path.dirname(publicFile), sourcePath), // Same directory
            normalizePathUnix(
              path.dirname(path.dirname(publicFile)),
              sourcePath
            ), // Parent directory
            normalizePathUnix(process.cwd(), sourcePath), // Root directory
            normalizePathUnix(post_generated_dir, sourcePath) // Custom directory
          ]);

          const result =
            potentialPaths.find((src) => fs.existsSync(src)) || null;

          if (!result) {
            const tempFolder = path.join(process.cwd(), 'tmp');
            const logfile = path.join(
              tempFolder,
              'hexo-post-parser/errors/post-asset-folder/',
              sanitizeFilename(path.basename(sourcePath).trim(), '-') + '.log'
            );

            writefile(
              logfile,
              JSON.stringify(
                {
                  str: sourcePath,
                  f1: potentialPaths[0],
                  f2: potentialPaths[1],
                  f3: potentialPaths[2],
                  f4: potentialPaths[3]
                },
                null,
                2
              )
            );

            log(logname, color.redBright('[fail]'), {
              str: sourcePath,
              log: logfile
            });
          } else {
            const normalizedResult = replaceArr(
              result,
              [
                upath.toUnix(process.cwd()),
                'source/',
                '_posts',
                `${siteConfig.post_dir || 'src-posts'}`
              ],
              '/'
            );

            const finalResult = removeDoubleSlashes(
              encodeURI((options.config?.root || '') + normalizedResult)
            );

            if (options.config?.verbose) {
              log(logname, '[success]', finalResult);
            }

            return finalResult;
          }
        }

        return sourcePath;
      };

      // @todo fix post_asset_folder
      if (options.fix) {
        if (meta.cover) {
          meta.cover = post_assets_fixer(meta.cover);
        }
        // fix thumbnail
        if (meta.thumbnail) {
          meta.thumbnail = post_assets_fixer(meta.thumbnail);
        }

        // add property photos by default
        if (!meta.photos) meta.photos = [];

        if (typeof body === 'string' && isFile) {
          // get all images from post body
          const imagefinderreplacement = function (whole: string, m1: string) {
            //log('get all images', m1);
            const regex = /(?:".*")/;
            let replacementResult: string;
            let img: string;
            if (regex.test(m1)) {
              const replacement = m1.replace(regex, '').trim();
              img = post_assets_fixer(replacement);
              replacementResult = whole.replace(replacement, img);
            }
            if (!replacementResult) {
              img = post_assets_fixer(m1);
              replacementResult = whole.replace(m1, img);
            }
            // push image to photos metadata
            if (typeof img === 'string') meta.photos.push(img);
            return replacementResult;
          };
          // markdown image
          body = body.replace(/!\[.*\]\((.*)\)/gm, imagefinderreplacement);
          // html image
          try {
            const regex = /<img [^>]*src="[^"]*"[^>]*>/gm;
            if (regex.test(body)) {
              body.match(regex).map((x) => {
                return x.replace(/.*src="([^"]*)".*/, imagefinderreplacement);
              });
            }
          } catch {
            log('cannot find image html from', meta.title);
          }
        }

        // fix photos
        if (Array.isArray(meta.photos)) {
          meta.photos = meta.photos
            .filter((str) => typeof str === 'string' && str.trim().length > 0)
            .map((photo) => post_assets_fixer(photo))
            // unique
            .filter(function (x, i, a) {
              return a.indexOf(x) === i;
            });
          // add thumbnail if not exist and photos length > 0
          if (!meta.thumbnail && meta.photos.length > 0) {
            meta.thumbnail = meta.photos[0];
          }
        }
      }

      /*
      if (!meta.permalink) {
        // log('permalink empty', publicFile);
        const homepage = siteConfig.url;
        const srcPostDir = normalize(
          join(process.cwd(), siteConfig.post_dir || 'src-posts')
        );
        const genPostDir = normalize(
          join(process.cwd(), siteConfig.source_dir, '_posts')
        );

        const pathnamePerm = normalize(publicFile)
          .replace(srcPostDir, '')
          .replace(genPostDir, '');
        log({ publicFile, pathnamePerm });
        const parsePerm = parsePermalink(pathnamePerm, {
          url: homepage,
          title: meta.title,
          permalink: siteConfig.permalink,
          date: String(meta.date)
        });
        meta.permalink = parsePerm;
      }
      */

      /*
      const homepage = siteConfig.url.endsWith('/')
    ? siteConfig.url
    : siteConfig.url + '/';
      const pathnamePerm = replaceArr(
        normalize(publicFile),
        [
          normalize(process.cwd()),
          siteConfig.source_dir + '/_posts/',
          `${siteConfig.post_dir || 'src-posts'}/`,
          '_posts/'
        ],
        '/'
      )
        // @todo remove multiple slashes
        .replace(/\/+/, '/')
        .replace(/^\/+/, '/');
      // @todo remove .md
      //.replace(/.md$/, '');
      // meta url with full url and removed multiple forward slashes

      debug('parse').extend('pathname')(pathnamePerm);

      const parsePerm = parsePermalink(pathnamePerm, {
        url: homepage,
        title: meta.title,
        permalink: siteConfig.permalink,
        date: String(meta.date)
      });

      if (!meta.permalink) meta.permalink = parsePerm;
      if (!meta.url) {
        meta.url = new URL(homepage + parsePerm)
          .toString()
          .replace(/([^:]\/)\/+/g, '$1');

        debug('parse').extend('url')(meta.url);
      }*/

      // determine post type
      //meta.type = toUnix(originalArg).isMatch(/(_posts|src-posts)\//) ? 'post' : 'page';
      if (!meta.type) {
        if (publicFile.match(/(_posts|_drafts|src-posts)\//)) {
          meta.type = 'post';
        } else {
          meta.type = 'page';
        }
      }
    }

    // set layout metadata
    /*if (options.config && 'generator' in options.config) {
      if (meta.type && !meta.layout && options.config.generator.type) {
        meta.layout = meta.type;
      }
    }*/

    if (typeof options === 'object') {
      // @todo format dates
      if (options.formatDate) {
        const pattern =
          typeof options.formatDate === 'object' && options.formatDate.pattern
            ? options.formatDate.pattern
            : 'YYYY-MM-DDTHH:mm:ssZ';

        if (meta.date) {
          meta.date = new parseDateMapper(String(meta.date)).format(pattern);
        }
        if (meta.updated) {
          meta.updated = new parseDateMapper(String(meta.updated)).format(
            pattern
          );
        }
      }
      // @todo process shortcodes
      if (options.shortcodes) {
        const shortcodes = options.shortcodes;
        let sourceFile: string;
        if (!isFile) {
          if (!options.sourceFile)
            throw new Error(
              'Shortcodes cannot process if options.sourceFile does not exist'
            );
          sourceFile = options.sourceFile;
        } else {
          sourceFile = upath.toUnix(originalFile);
        }

        if (body) {
          if (sourceFile) {
            if (shortcodes.include) {
              // @todo parse shortcode include
              body = parseShortCodeInclude(sourceFile, body);
            }
            if (shortcodes.now) body = shortcodeNow(sourceFile, body);
            if (shortcodes.script) body = shortcodeScript(sourceFile, body);
            if (shortcodes.css) body = shortcodeCss(sourceFile, body);
            if (shortcodes.text) body = extractText(sourceFile, body);
          }
          if (shortcodes.link) body = replaceMD2HTML(body);
          if (shortcodes.youtube) body = shortcodeYoutube(body);
          if (shortcodes.codeblock) body = await shortcodeCodeblock(body);
        }
      }
    }

    // sort metadata
    meta = Object.keys(meta)
      .sort()
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: meta[key]
        }),
        {}
      ) as postMap['metadata'];

    // re-order meta keys alphabetically
    meta = sortObjectByKeys(meta);

    const result: postMap = {
      metadata: meta,
      body: body,
      content: body,
      rawbody,
      config: <any>siteConfig
    };

    if (siteConfig.generator?.type === 'jekyll') {
      result.metadata.slug = result.metadata.permalink;
    }

    // put fileTree
    if (isFile) {
      result.fileTree = {
        source: replaceArr(
          upath.toUnix(originalFile),
          ['source/_posts/', '_posts/'],
          'src-posts/'
        ),
        public: upath
          .toUnix(originalFile)
          .replace(`/${siteConfig.post_dir || 'src-posts'}/`, '/source/_posts/')
      };
    }

    if (meta && body) _cache.putSync(cacheKey, result);

    return result;
  };

  const mapper = async (m: Nullable<RegExpMatchArray | postMeta>) => {
    if (!m) {
      throw new Error(originalFile + ' cannot be mapped');
    }

    let body = '';
    let meta = {};

    if (Array.isArray(m)) {
      body = m[2];
      try {
        meta = yaml.parse(m[1]) || meta;
      } catch (error: any) {
        error.sourceFile = options.sourceFile;
        const w = writefile(
          path.join(
            tmpDir,
            'errors',
            sanitizeFilename(path.basename(options.sourceFile).trim(), '-') +
              '.json'
          ),
          jsonStringifyWithCircularRefs(error)
        );
        console.error('metadata error written', w.file);
        return null;
      }
    } else {
      meta = Object.assign(meta, m);
    }

    if (typeof meta !== 'object') {
      //writeFileSync(join(cwd(), 'tmp/dump.json'), JSON.stringify(m, null, 2));
      //log('meta required object');
      return null;
    }

    return await processParsed(body, meta);
  };

  // const countTripleHypens = target.split('---').length - 1;
  // log('triple hypens', countTripleHypens);

  try {
    // markdown-it sometimes has multiple triple hypens
    // Regex pattern to match the frontmatter and capture the body
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = target.match(frontmatterRegex);
    // if (match) log('match.length', match.length);
    if (match && match.length === 3) {
      const frontMatterObject = match[1].trim();
      const frontMatterBody = match[2].trim();
      log('new parser test passed', isFile ? `for ${originalFile}` : '');

      // Parse the frontmatter into an object
      let metadata: Record<string, any>;
      try {
        metadata = yaml.parse(frontMatterObject);
      } catch (_e) {
        metadata = frontMatterObject.split('\n').reduce((acc, line) => {
          const [key, ...value] = line.split(':');
          acc[key.trim()] = value.join(':').trim().startsWith('[')
            ? JSON.parse(value.join(':').trim())
            : value.join(':').trim();
          return acc;
        }, {});
      }
      return await processParsed(frontMatterBody, metadata);
    }
  } catch (_e) {
    //
  }

  try {
    const frontMatterRegex = /^(.*?)\n---/s;
    const bodyRegex = /---\n([\s\S]*)$/;

    // Extract front-matter
    const frontMatterMatch = target.match(frontMatterRegex);
    let frontMatterObject: Nullable<Record<string, any>> = undefined;
    let frontMatterBody: Nullable<string> = undefined;

    if (frontMatterMatch) {
      const frontMatter = frontMatterMatch[1];
      const frontMatterLines = frontMatter
        .split('\n')
        .map((line) => line.trim());

      frontMatterObject = {};

      frontMatterLines.forEach((line) => {
        const [key, ...value] = line.split(':');
        if (key) {
          frontMatterObject[key.trim()] = value.join(':').trim();
        }
      });
    }

    // Extract body
    const bodyMatch = target.match(bodyRegex);
    if (bodyMatch) {
      frontMatterBody = bodyMatch[1].trim(); // Trim to remove leading/trailing whitespace
    }

    if (frontMatterBody !== undefined && frontMatterObject !== undefined) {
      log(
        'new hexo page parser test passed',
        isFile ? `for ${originalFile}` : ''
      );
      return await processParsed(frontMatterBody, frontMatterObject);
    }
  } catch (_e) {
    //
  }

  // test opening metadata tag
  const regexPost = /^---([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/g;
  const testPost = (await Promise.all(
    Array.from(target.matchAll(regexPost)).map(mapper)
  )[0]) as Nullable<postMap>;
  if (typeof testPost === 'object' && testPost !== null) {
    log('test 1 passed');
    return testPost;
  }

  // test non-opening metadata tag
  const regexPostNoOpening = /^([\s\S]*?)---[\n\s\S]\n([\n\s\S]*)/g;
  const testPost2 = (await Promise.all(
    Array.from(target.matchAll(regexPostNoOpening)).map(mapper)
  )[0]) as Nullable<postMap>;
  if (typeof testPost2 === 'object' && testPost2 !== null) {
    log('test 2 passed');
    return testPost2;
  }

  log.extend('error')('all test failed, using front-matter parser');

  const regexPage = /^---([\s\S]*?)---[\n\s\S]([\n\s\S]*)/gm;
  const testPage = (await Promise.all(
    Array.from(target.matchAll(regexPage)).map(mapper)
  )[0]) as Nullable<postMap>;
  if (typeof testPage === 'object' && testPage !== null) return testPage;

  const parseFM = parsePostFM(target);
  const mapFM = await mapper(parseFM.attributes);
  mapFM.rawbody = parseFM.body;
  if (typeof mapFM === 'object' && mapFM !== null) {
    return mapFM;
  }
}

export default parsePost;
