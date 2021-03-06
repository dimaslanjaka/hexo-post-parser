"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateMapper = exports.isToday = exports.moment = void 0;
const tslib_1 = require("tslib");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const _config_1 = tslib_1.__importDefault(require("./types/_config"));
function moment(date = new Date(), format) {
    let parse = (0, moment_timezone_1.default)(date, format);
    if (_config_1.default.timezone) {
        parse = parse.tz(_config_1.default.timezone);
    }
    return parse;
}
exports.moment = moment;
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
class dateMapper {
    constructor(date) {
        this.format = (pattern) => this.data.format(pattern);
        this.year = () => this.data.format('YYYY');
        this.toString = () => this.data.format('YYYY-MM-DDTHH:mm:ssZ');
        if (typeof date == 'string' && date.length > 0) {
            if (/\s/.test(date)) {
                // process date for spaced data format
                try {
                    // format di configured pattern
                    this.data = moment(date, `${_config_1.default.date_format} ${_config_1.default.time_format}`);
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
exports.dateMapper = dateMapper;
//# sourceMappingURL=dateMapper.js.map