export * from './globals';
export { ParseOptions } from './parseOptions';
export { postAuthor } from './postAuthor';
export { postMap } from './postMap';
export { postMeta } from './postMeta';

export interface DynamicObject {
  [keys: string]: any;
}
