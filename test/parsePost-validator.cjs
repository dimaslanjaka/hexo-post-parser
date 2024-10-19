/**
 * validate parsed post
 * @param {import("../src").postMap} post
 */
function parsedPostValidate(post) {
  if (!post) {
    throw new Error('post is null');
  }
  console.log(post);
  const { metadata } = post;
  if (metadata) {
    console.log('Title', metadata.title);
  }
}

module.exports = parsedPostValidate;
module.exports.parsedPostValidator = parsedPostValidate;
