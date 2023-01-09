import { default as momentInstance } from 'moment-timezone';
import { getConfig } from './types/_config';

export /**
 * Localized Moment
 * @param date
 * @returns
 */
function moment(
  date: momentInstance.MomentInput = new Date(),
  format?: string
) {
  try {
    let parse = momentInstance(date, format);
    const config = getConfig();
    if (config.timezone) {
      parse = parse.tz(config.timezone);
    }
    return parse;
  } catch {
    console.log('cannot parse date', String(date));
    return momentInstance();
  }
}

/**
 * Moment check date is today
 * @param date
 * @returns
 */
export const isToday = (date: any) => moment(0, 'HH').diff(date, 'days') == 0;

/**
 * HexoJS date formatter
 * * Playground Test {@link https://codepen.io/dimaslanjaka/pen/LYegjaV}
 */
export class dateMapper {
  data: moment.Moment;
  constructor(date: moment.MomentInput) {
    const config = getConfig();
    if (typeof date == 'string' && date.length > 0) {
      if (/\s/.test(date)) {
        // process date for spaced data format
        try {
          // format di configured pattern
          this.data = moment(
            date,
            `${config.date_format} ${config.time_format}`
          );
        } catch (error) {
          // format with default pattern
          this.data = moment(date, 'YYYY-MM-DD HH:mm:ss');
        }
      } else {
        // format without pattern (RFC)
        this.data = moment(date);
      }
    }
  }
  format = (pattern: string) => this.data.format(pattern);
  year = () => this.data.format('YYYY');
  toString = () => this.data.format('YYYY-MM-DDTHH:mm:ssZ');
}
