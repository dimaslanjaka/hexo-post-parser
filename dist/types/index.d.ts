export { ParseOptions } from './parseOptions';
export { postAuthor } from './postAuthor';
export { postMap } from './postMap';
export { postMeta } from './postMeta';
export { getConfig, setConfig } from './_config';
export interface DynamicObject extends Object {
    [keys: string]: any;
}
