import { describe, expect, it } from '@jest/globals';
import {
  removeDoubleSlashes,
  countWordsBoundary,
  countWords
} from '../../src/utils/string';

describe('removeDoubleSlashes', () => {
  it('replaces consecutive slashes with a single slash', () => {
    const input =
      '//post-assets-folder///post-assets-folder/asset-folder/spinner-200px.svg';
    const expected =
      '/post-assets-folder/post-assets-folder/asset-folder/spinner-200px.svg';
    expect(removeDoubleSlashes(input)).toBe(expected);
  });

  it('preserves protocol slashes and collapses path slashes for URLs', () => {
    const url = 'https://example.com//a///b/index.html';
    const expected = 'https://example.com/a/b/index.html';
    expect(removeDoubleSlashes(url)).toBe(expected);
  });
});

describe('countWordsBoundary', () => {
  it('counts words after trimming and collapsing multiple spaces', () => {
    expect(countWordsBoundary('  hello   world  ')).toBe(2);
    expect(countWordsBoundary('one two three')).toBe(3);
  });
});

describe('countWords', () => {
  it('counts words ignoring punctuation and extra whitespace', () => {
    expect(countWords('Hello, world!')).toBe(2);
    expect(countWords('   ')).toBe(0);
    expect(countWords('Hello-world 123')).toBe(2);
  });
});
