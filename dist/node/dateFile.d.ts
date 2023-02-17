/**
 * Get information date of files
 */
/// <reference types="node" />
import * as fs from 'fs';
/**
 * get modified date of file
 * @param path
 * @returns
 */
export declare function getModifiedDateOfFile(path: fs.PathLike): Promise<{
    mtime: Date;
    ctime: Date;
    'Status Last Modified': Date;
    'Data Last Modified': Date;
}>;
