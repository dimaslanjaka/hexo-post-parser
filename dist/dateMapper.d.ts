import { default as momentInstance } from 'moment-timezone';
export declare function moment(date?: any, format?: string): momentInstance.Moment;
/**
 * Moment check date is today
 * @param date
 * @returns
 */
export declare const isToday: (date: any) => boolean;
/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
export declare class dateMapper {
    data: moment.Moment;
    constructor(date: moment.MomentInput);
    format: (pattern: string) => string;
    year: () => string;
    toString: () => string;
}
