import { moment } from './dateMapper';
import debug from './node/debug';
import { getConfig } from './types/_config';

/**
 * transform permalink format in `_config.yml`
 * @param post post path
 */
export function parsePermalink(
  post: string,
  config: {
    [key: string]: any;
    permalink: string;
    url: string;
    /**
     * post created date
     */
    date: moment.MomentInput;
    /**
     * post title
     */
    title: string;
  }
) {
  let pattern = config.permalink || getConfig().permalink;
  const date: moment.MomentInput = config.date;

  const replacer: Record<string, string> = {
    ':month': 'MM',
    ':year': 'YYYY',
    ':day': 'DD',
    ':i_month': 'M',
    ':hour': 'HH',
    ':minute': 'mm',
    ':second': 'ss',
    ':title': String(post).replace(/.(md|html)$/, ''),
    ':post_title': config.title
  };

  //console.log({ url, curl: config.url });

  // @todo [permalink] follow directory path
  /*if (pattern.startsWith(':title')) {
    const bname = pattern.replace(':title', replacer[':title']);
    const perm = path.join(path.dirname(String(url)), bname);
    debug('permalink')(perm);
    return perm;
  }*/

  for (const date_pattern in replacer) {
    if (Object.prototype.hasOwnProperty.call(replacer, date_pattern)) {
      if (
        [':title', ':post_title', ':id', ':category', ':hash'].includes(
          date_pattern
        )
      ) {
        pattern = pattern.replace(date_pattern, replacer[date_pattern]);
      } else {
        pattern = pattern.replace(
          date_pattern,
          moment(date).format(replacer[date_pattern])
        );
      }
    }
  }

  // replace %20 to space
  const newPattern = pattern.replace(/%20/g, ' ');
  if (/^https?:\/\//.test(newPattern)) return newPattern;
  const result = newPattern.replace(/\/{2,10}/g, '/').replace(config.url, '');

  debug('permalink')(result);
  return result;
}
