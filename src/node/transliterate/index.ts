// https://github.com/sindresorhus/transliterate
import deburr from 'lodash.deburr';
import escapeStringRegexp from '../escape-string-regexp';
import builtinReplacements from './replacements';

const doCustomReplacements = (
  string: string,
  replacements: Map<unknown, any>
) => {
  for (const [key, value] of replacements) {
    // TODO: Use `String#replaceAll()` when targeting Node.js 16.
    string = string.replace(
      new RegExp(escapeStringRegexp(key as any), 'g'),
      value
    );
  }

  return string;
};

export default function transliterate(
  string: string,
  options: { customReplacements: any }
) {
  if (typeof string !== 'string') {
    throw new TypeError(`Expected a string, got \`${typeof string}\``);
  }

  options = {
    customReplacements: [],
    ...options
  };

  const customReplacements = new Map([
    ...builtinReplacements,
    ...options.customReplacements
  ]);

  string = string.normalize();
  string = doCustomReplacements(string, customReplacements);
  string = deburr(string);

  return string;
}
