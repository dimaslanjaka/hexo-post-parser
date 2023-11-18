declare const nocache: any;
declare const verbose: any;
declare const defaultSiteOptions: import('hexo')['config'];
export type SiteConfig = typeof defaultSiteOptions & Record<string, any>;
/**
 * find `_config.yml` and set to config
 * @param file
 */
export declare function findConfig(file?: string): void;
/**
 * get site _config.yml
 * @returns
 */
export declare function getConfig(): SiteConfig;
/**
 * assign new option
 * @param obj
 * @returns
 */
export declare function setConfig(obj: Record<string, any>): SiteConfig;
export { nocache, verbose };
type HC = import('sbg-utility').config.ProjConf;
export interface ProjectConfig extends HC {
    [key: string]: any;
    /**
     * Source posts
     */
    post_dir: string;
    /**
     * Project CWD
     */
    cwd: string;
}
/**
 * Hexo Generated Dir
 */
export declare const post_generated_dir: string;
/**
 * SBG Source Post Dir
 */
export declare const post_source_dir: string;
