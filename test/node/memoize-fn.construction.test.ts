import { test, expect, describe } from '@jest/globals';
import memoizer from '../../src/node/memoize-fs';

describe('memoizer construction', () => {
  test('creates instance with default cacheDir and verbose=false', () => {
    const inst = new memoizer();
    expect(inst.verbose).toBe(false);
    expect(inst.cacheDir).toEqual(expect.any(String));
    expect(inst.cacheDir).toContain('memoize-fs');
  });

  test('fn property is the same function reference as memoize', () => {
    const inst = new memoizer();
    expect(inst.fn).toBe(inst.memoize);
  });
});
