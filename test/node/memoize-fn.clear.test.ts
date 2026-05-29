import { test, expect, beforeEach, afterEach, describe } from '@jest/globals';
import fs from 'fs-extra';
import { createMemoizer, tmpDir } from './memoize-fn.helpers';
import memoizer from '../../src/node/memoize-fs';

describe('clear', () => {
  const dir = tmpDir('test-memoize-clear');
  let inst: memoizer;

  beforeEach(() => {
    fs.mkdirpSync(dir);
    inst = createMemoizer(dir);
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('clearing forces recomputation on next call', () => {
    let callCount = 0;
    const fn = (n: number) => {
      callCount++;
      return n * 2;
    };
    const memoized = inst.memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(1);

    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(1);

    inst.clear(fn, 5);
    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(2);
  });

  test('clear does not throw when cache does not exist', () => {
    const fn = (x: number) => x;
    expect(() => inst.clear(fn, 999)).not.toThrow();
    expect(() => inst.clear(fn)).not.toThrow();
  });
});
