import { test, expect, describe } from '@jest/globals';
import memoizer from '../../src/node/memoize-fs';

describe('determineType', () => {
  const inst = new memoizer();

  test('classifies values correctly', () => {
    expect(inst.determineType('str')).toBe('string');
    expect(inst.determineType(0)).toBe('number');
    expect(inst.determineType(true)).toBe('boolean');
    expect(inst.determineType([1])).toBe('array');
    expect(inst.determineType({})).toBe('object');
    expect(inst.determineType(undefined)).toBe('undefined');
    expect(inst.determineType(null)).toBe('object');
    expect(inst.determineType(Symbol('s'))).toBe('symbol');
  });
});
