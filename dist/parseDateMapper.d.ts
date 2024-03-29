import { default as momentInstance } from 'moment-timezone';
export declare function moment(date?: momentInstance.MomentInput, format?: string): momentInstance.Moment;
/**
 * custom moment
 */
export declare const cmoment: typeof moment;
export declare const customMoment: typeof moment;
export declare const momentHpp: typeof moment;
/**
 * Moment check date is today
 * @param date
 * @returns
 */
export declare const isToday: (date: any) => boolean;
export type DateMapperInput = momentInstance.MomentInput | parseDateMapper;
/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
export declare class parseDateMapper {
    data: momentInstance.Moment;
    constructor(date: DateMapperInput);
    format: (pattern: string) => string;
    year: () => string;
    toString: () => string;
}
