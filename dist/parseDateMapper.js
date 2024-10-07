"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateMapper = exports.isToday = exports.momentHpp = exports.customMoment = exports.cmoment = void 0;
exports.moment = moment;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const _config_1 = require("./types/_config");
function moment(date = new Date(), format //= 'YYYY-MM-DDTHH:mm:ssZ'
) {
    try {
        let parse = (0, moment_timezone_1.default)(date, format);
        // fix ISO date format
        const isISO = typeof date === 'string' && date.endsWith('Z');
        if (isISO) {
            parse = parse.utc();
        }
        else {
            const config = (0, _config_1.getConfig)();
            if (config.timezone) {
                parse = parse.tz(config.timezone || 'UTC');
            }
        }
        return parse;
    }
    catch (_a) {
        console.log('cannot parse date', String(date));
        return (0, moment_timezone_1.default)();
    }
}
/**
 * custom moment
 */
exports.cmoment = moment;
exports.customMoment = moment;
exports.momentHpp = moment;
/**
 * Moment check date is today
 * @param date
 * @returns
 */
const isToday = (date) => moment(0, 'HH').diff(date, 'days') == 0;
exports.isToday = isToday;
/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
class parseDateMapper {
    constructor(date) {
        this.format = (pattern) => this.data.format(pattern);
        this.year = () => this.data.format('YYYY');
        this.toString = () => this.data.format('YYYY-MM-DDTHH:mm:ssZ');
        const config = (0, _config_1.getConfig)();
        if (typeof date == 'string' && date.length > 0) {
            date = date.trim();
            if (/\s/.test(date)) {
                // process date for spaced data format
                try {
                    // format di configured pattern
                    this.data = moment(date, `${config.date_format} ${config.time_format}`);
                }
                catch (error) {
                    // format with default pattern
                    this.data = moment(date, 'YYYY-MM-DD HH:mm:ss');
                }
            }
            else {
                // format without pattern (RFC)
                this.data = moment(date);
            }
        }
    }
}
exports.parseDateMapper = parseDateMapper;
