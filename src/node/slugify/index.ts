// https://github.com/sindresorhus/slugify
import escapeStringRegexp from '../escape-string-regexp';
import transliterate from '../transliterate/index';
import builtinOverridableReplacements from './replacements';

const decamelize = (str: string) => {
  return (
    str
      // Separate capitalized words.
      .replace(/([A-Z]{2,})(\d+)/g, '$1 $2')
      .replace(/([a-z\d]+)([A-Z]{2,})/g, '$1 $2')
      .replace(/([a-z\d])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
  );
};

const removeMootSeparators = (str: string, separator: any) => {
  const escapedSeparator = escapeStringRegexp(separator);

  return str
    .replace(new RegExp(`${escapedSeparator}{2,}`, 'g'), separator)
    .replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, 'g'), '');
};

const defOpt = {
  separator: '-',
  lowercase: true,
  decamelize: true,
  customReplacements: [] as string[],
  preserveLeadingUnderscore: false,
  preserveTrailingDash: false
};

export type SlugifyOpt =
  | typeof defOpt
  | {
      [key: string]: any;
    };

export default function slugify(string: string, options: SlugifyOpt = {}) {
  if (typeof string !== 'string') {
    throw new TypeError(`Expected a string, got \`${typeof string}\``);
  }

  options = Object.assign(defOpt, options);

  const shouldPrependUnderscore =
    options.preserveLeadingUnderscore && string.startsWith('_');
  const shouldAppendDash = options.preserveTrailingDash && string.endsWith('-');

  const customReplacements = new Map([
    ...builtinOverridableReplacements,
    ...options.customReplacements
  ]);

  string = transliterate(string, { customReplacements });

  if (options.decamelize) {
    string = decamelize(string);
  }

  let patternSlug = /[^a-zA-Z\d]+/g;

  if (options.lowercase) {
    string = string.toLowerCase();
    patternSlug = /[^a-z\d]+/g;
  }

  string = string.replace(patternSlug, options.separator);
  string = string.replace(/\\/g, '');
  if (options.separator) {
    string = removeMootSeparators(string, options.separator);
  }

  if (shouldPrependUnderscore) {
    string = `_${string}`;
  }

  if (shouldAppendDash) {
    string = `${string}-`;
  }

  return string;
}

export function slugifyWithCounter() {
  const occurrences = new Map();

  const countable = (str: string, options: SlugifyOpt) => {
    str = slugify(str, options);

    if (!str) {
      return '';
    }

    const stringLower = str.toLowerCase();
    const numberless =
      occurrences.get(stringLower.replace(/(?:-\d+?)+?$/, '')) || 0;
    const counter = occurrences.get(stringLower);
    occurrences.set(stringLower, typeof counter === 'number' ? counter + 1 : 1);
    const newCounter = occurrences.get(stringLower) || 2;
    if (newCounter >= 2 || numberless > 2) {
      str = `${str}-${newCounter}`;
    }

    return str;
  };

  countable.reset = () => {
    occurrences.clear();
  };

  return countable;
}
