/// <reference types="node" />
import spawner from './spawner';
declare class process {
    /**
     * Root terminal
     */
    static root: string;
    /**
     * Debug
     */
    static verbose: boolean;
    /**
     * Compiler temp folder
     */
    static tmp: string;
    /**
     * Current process unique id
     */
    static id: string;
    /**
     * process instance `import coreProcess from "process";`
     */
    static core: NodeJS.Process;
    static isWin: boolean;
    static spawner: typeof spawner;
    /**
     * Kill All Node Processes
     */
    static killNode(): void;
    /**
     * Create lock file
     * @param file
     */
    static lockCreate(file: string): string;
    /**
     * do process
     * @param lockfile
     * @param options
     * @param callback
     */
    static doProcess(lockfile: string, options: {
        verbose: boolean;
    } | any, callback: any): any;
    /**
     * lock the process
     * @param lockfile
     */
    private static lockProcess;
    /**
     * release lock process
     * @param lockfile
     */
    private static releaseLock;
}
export default process;
