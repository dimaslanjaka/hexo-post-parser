import { describe, expect, test } from '@jest/globals';
import * as wilcards from '../src';

// jest --runInBand imports.test

describe('check method', () => {
  const props = [
    'parsePost',
    'buildPost',
    'renderShowdown',
    'renderMarkdownIt',
    'renderMarked',
    'parsePermalink',
    'momentHpp'
  ];

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    test(`wilcards.${prop} is function`, function () {
      expect(typeof wilcards[prop]).toBe('function');
    }, 10000);
  }
});
