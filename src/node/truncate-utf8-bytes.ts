// forked from module `truncate-utf8-bytes`
'use strict';

function isHighSurrogate(codePoint: number) {
  return codePoint >= 0xd800 && codePoint <= 0xdbff;
}

function isLowSurrogate(codePoint: number) {
  return codePoint >= 0xdc00 && codePoint <= 0xdfff;
}

// Truncate string by size in bytes
function truncate(
  getLength: (arg0: string) => number,
  str: string | string[],
  byteLength: number
) {
  if (typeof str !== 'string') {
    throw new Error('Input must be string');
  }

  const charLength = str.length;
  let curByteLength = 0;
  let codePoint;
  let segment;

  for (let i = 0; i < charLength; i += 1) {
    codePoint = str.charCodeAt(i);
    segment = str[i];

    if (isHighSurrogate(codePoint) && isLowSurrogate(str.charCodeAt(i + 1))) {
      i += 1;
      segment += str[i];
    }

    curByteLength += getLength(segment);

    if (curByteLength === byteLength) {
      return str.slice(0, i + 1);
    } else if (curByteLength > byteLength) {
      return str.slice(0, i - segment.length + 1);
    }
  }

  return str;
}

const getLength = Buffer.byteLength.bind(Buffer);
const main = truncate.bind(null, getLength);
export default main;
