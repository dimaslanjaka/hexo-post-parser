const chalk = require('chalk');
/**
 * Callback Post Imported XML
 * @param {string} content
 * @param {import("../packages/hexo-blogger-xml/src/types/post-header").PostHeader} headers
 * @returns {string}
 */
function post_callback(content, headers) {
  console.log('Process callback article', chalk.magenta(headers.title));

  //https://cdn.rawgit.com/dimaslanjaka/Web-Manajemen/master/Animasi/text-animasi.html
  //replace old cdn.rawgit.com to github page
  content = content.replace(
    new RegExp('https://cdn.rawgit.com/dimaslanjaka', 'm'),
    'https://www.webmanajemen.com/'
  );
  return content;
}

module.exports = post_callback;
module.exports.post_callback = post_callback;
