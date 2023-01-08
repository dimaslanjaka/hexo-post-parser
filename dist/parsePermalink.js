"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePermalink = void 0;
const upath_1 = __importDefault(require("upath"));
const dateMapper_1 = require("./dateMapper");
const debug_1 = __importDefault(require("./node/debug"));
const _config_1 = require("./types/_config");
/**
 * transform permalink format in `_config.yml`
 * @param post
 */
function parsePermalink(post) {
    var _a;
    if (typeof post.metadata !== 'object')
        return;
    if (typeof post.metadata.permalink === 'string')
        return post.metadata.permalink;
    const config = (0, _config_1.getConfig)();
    let pattern = config.permalink || ':title.html';
    const date = (0, dateMapper_1.moment)(post.metadata.date);
    const url = (_a = post.metadata.url) === null || _a === void 0 ? void 0 : _a.replace(config.url, '');
    const replacer = {
        ':month': 'MM',
        ':year': 'YYYY',
        ':day': 'DD',
        ':i_month': 'M',
        ':hour': 'HH',
        ':minute': 'mm',
        ':second': 'ss',
        ':title': url.replace(/.(md|html)$/, ''),
        ':post_title': post.metadata.title
    };
    //console.log({ url, curl: config.url });
    // @todo [permalink] follow directory path
    if (pattern.startsWith(':title')) {
        const bname = pattern.replace(':title', replacer[':title']);
        const perm = upath_1.default.join(upath_1.default.dirname(url), bname);
        (0, debug_1.default)('permalink')(perm);
        return perm;
    }
    for (const date_pattern in replacer) {
        if (Object.prototype.hasOwnProperty.call(replacer, date_pattern)) {
            if ([':title', ':post_title', ':id', ':category', ':hash'].includes(date_pattern)) {
                pattern = pattern.replace(date_pattern, replacer[date_pattern]);
            }
            else {
                pattern = pattern.replace(date_pattern, date.format(replacer[date_pattern]));
            }
        }
    }
    // replace %20 to space
    const newPattern = pattern.replace(/%20/g, ' ');
    if (/^https?:\/\//.test(newPattern))
        return newPattern;
    const result = newPattern.replace(/\/{2,10}/g, '/');
    (0, debug_1.default)('permalink')(result);
    return result;
}
exports.parsePermalink = parsePermalink;
//# sourceMappingURL=parsePermalink.js.map