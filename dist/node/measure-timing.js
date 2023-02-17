"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Timer measurement
 * @see {@link https://stackoverflow.com/a/69985194/6404439}
 */
class MeasureTime {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
    }
    start() {
        this.startTime = new Date().getTime();
        return this;
    }
    /**
     * end indicator
     * @returns dump
     */
    end() {
        this.endTime = new Date().getTime();
        return this.toString();
    }
    measure() {
        console.log(this.toString());
    }
    toString() {
        return `time taken => ${(this.endTime - this.startTime) / 1000} seconds`;
    }
}
exports.default = MeasureTime;
//# sourceMappingURL=measure-timing.js.map