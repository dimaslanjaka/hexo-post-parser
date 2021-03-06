import { DeepPartial } from '../parsePost';
import { postMeta } from './postMeta';
import config from './_config';
export interface postMap extends Object {
    [key: string]: any;
    /**
     * Article metadata as string
     */
    metadataString?: string;
    fileTree?: {
        /**
         * [post source] post file from `src-posts/`
         */
        source?: string;
        /**
         * [public source] post file from source_dir _config.yml
         */
        public?: string;
    };
    /**
     * _config.yml
     */
    config?: DeepPartial<typeof config> | null;
    /**
     * Article metadata
     */
    metadata?: postMeta;
    /**
     * Article body
     */
    body?: string;
    /**
     * Article body (unused when property `body` is settled)
     */
    content?: string;
}
