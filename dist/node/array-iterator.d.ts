export declare class array_iterator {
    data: any[];
    constructor(arr: any[]);
    /**
     * @see {@link https://stackoverflow.com/a/62889031/6404439}
     * @returns
     */
    values(): {
        [Symbol.iterator](): any;
        next(): {
            value: any;
            done: boolean;
        } | {
            done: boolean;
            value?: undefined;
        };
        previous(): {
            value: any;
            done: boolean;
        } | {
            done: boolean;
            value?: undefined;
        };
    };
}
