import { test, expect, beforeEach, describe } from '@jest/globals';
import { tmpDir } from './memoize-fn.helpers';
import memoizer from '../../src/node/memoize-fs';

describe('getCacheFilePath', () => {
  const dir = tmpDir('test-memoize-path');
  let inst: memoizer;

  beforeEach(() => {
    inst = new memoizer();
    inst.cacheDir = dir;
    inst.verbose = false;
  });

  test('returns absolute path containing cacheDir and md5 hashes', () => {
    const fn = (x: number) => x;
    const fp = inst.getCacheFilePath(fn, 42);
    expect(fp).toContain(dir);
    expect(fp).toMatch(/[a-f0-9]{32}/i);
  });

  test('different functions produce different paths for same args', () => {
    const fnA = (x: number) => x;
    const fnB = (x: number) => x * 2;
    expect(inst.getCacheFilePath(fnA, 5)).not.toBe(
      inst.getCacheFilePath(fnB, 5)
    );
  });

  test('same function with different args produces different paths', () => {
    const fn = (a: number, b: number) => a + b;
    expect(inst.getCacheFilePath(fn, 1, 2)).not.toBe(
      inst.getCacheFilePath(fn, 3, 4)
    );
  });

  test('with no args returns only function-hash path', () => {
    const fn = () => 'noop';
    const noArgs = inst.getCacheFilePath(fn);
    const withArgs = inst.getCacheFilePath(fn, 1);
    expect(noArgs).not.toBe(withArgs);
  });
});
