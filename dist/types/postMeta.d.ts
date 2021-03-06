import { dateMapper } from '../dateMapper';
import { postAuthor } from '../parsePost';
/**
 * post metadata information (title, etc)
 */
export interface postMeta {
    [key: string]: any;
    /**
     * Article language code
     */
    lang?: string;
    /**
     * Article title
     */
    title: string;
    /**
     * published indicator
     * * 1 / true = published
     * * 0 / false = drafted
     */
    published?: boolean | 1 | 0;
    /**
     * post description
     */
    description?: string;
    /**
     * Auto generated fixed id with uuid v4
     */
    id?: string;
    /**
     * Post modified date
     */
    updated?: string | dateMapper;
    /**
     * Author metadata
     */
    author?: string | postAuthor;
    /**
     * Post published date
     */
    date?: string | dateMapper;
    /**
     * Post tags
     */
    tags?: string[];
    /**
     * Post categories
     */
    category?: string[];
    /**
     * All photos of post/page
     */
    photos?: string[];
    /**
     * thumbnail
     */
    cover?: string;
    /**
     * thumbnail (unused when `cover` property is settled)
     */
    thumbnail?: string;
    /**
     * Post moved indicator
     * * canonical should be replaced to this url
     * * indicate this post was moved to another url
     */
    redirect?: string;
    /**
     * full url
     */
    url?: string;
    /**
     * just pathname
     */
    permalink?: string;
    /**
     * archive (index, tags, categories)
     */
    type?: 'post' | 'page' | 'archive';
}
