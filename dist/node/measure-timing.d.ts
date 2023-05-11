/**
 * Timer measurement
 * @see {@link https://stackoverflow.com/a/69985194/6404439}
 */
export default class MeasureTime {
    private startTime;
    private endTime;
    start(): this;
    /**
     * end indicator
     * @returns dump
     */
    end(): string;
    measure(): void;
    toString(): string;
}
