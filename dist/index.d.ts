import './a_index';
import { buildPost } from './buildPost';
import { parsePost } from './parsePost';
export { generatePostId } from './generatePostId';
export { parsePermalink } from './parsePermalink';
export { DeepPartial, Nullable, ParseOptions } from './parsePost';
export { postMap } from './types/postMap';
export { postMeta } from './types/postMeta';
export { parsePost, buildPost };
export declare const obj: {
    parsePost: typeof parsePost;
    buildPost: typeof buildPost;
};
export default obj;
