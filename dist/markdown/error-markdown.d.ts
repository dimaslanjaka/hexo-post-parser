export declare const EOL = "\n";
/**
 * Error markdown logger
 */
export default class ErrorMarkdown {
    result: {
        [key: string]: any;
    };
    name: string;
    message: string;
    stack?: string;
    filelog: string;
    constructor(obj?: Record<string, unknown> | string, hash?: string);
    /**
     * add log property
     * @param k
     * @param v
     * @returns
     */
    add(k: string | number, v: any): this;
    /**
     * log writter
     * @returns
     */
    writeLog(): this;
    getFileLog(): string;
    /**
     * Remove property log
     * @param k
     * @returns
     */
    remove(k: string | number): this;
    toString(): string;
}
