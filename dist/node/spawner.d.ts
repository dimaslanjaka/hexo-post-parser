/// <reference types="node" />
import { ChildProcess, ChildProcessWithoutNullStreams, SpawnOptions } from 'child_process';
declare class spawner {
    static children: ChildProcessWithoutNullStreams[];
    private static onExit;
    /**
     * Spawn Commands
     * @param command node
     * @param args ['index.js']
     * @param callback callback for children process
     */
    static spawn(command: string, args?: string[], opt?: SpawnOptions, callback?: (path: ChildProcess) => any): ChildProcess;
    /**
     * Kill all ChildProcessWithoutNullStreams[]
     */
    static children_kill(): void;
}
export default spawner;
