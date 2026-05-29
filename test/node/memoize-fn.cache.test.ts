import { test, expect, beforeEach, afterEach, describe } from '@jest/globals';
import fs from 'fs-extra';
import { createMemoizer, createTrackedFn, tmpDir } from './memoize-fn.helpers';
import memoizer from '../../src/node/memoize-fs';

describe('memoize real caching', () => {
  const dir = tmpDir('test-memoize-fn');
  let inst: memoizer;

  beforeEach(() => {
    fs.mkdirpSync(dir);
    inst = createMemoizer(dir);
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('first call computes and caches result; second call returns cached value', () => {
    const tracked = createTrackedFn();
    const memoized = inst.memoize(tracked);

    const r1 = memoized(2, 3);
    expect(r1).toBe(5);
    expect(tracked.getCount()).toBe(1);

    const r2 = memoized(2, 3);
    expect(r2).toBe(5);
    expect(tracked.getCount()).toBe(1);
  });

  test('different arguments recompute and produce separate cache entries', () => {
    const tracked = createTrackedFn();
    const memoized = inst.memoize(tracked);

    expect(memoized(1, 1)).toBe(2);
    expect(tracked.getCount()).toBe(1);

    expect(memoized(2, 2)).toBe(4);
    expect(tracked.getCount()).toBe(2);

    expect(memoized(1, 1)).toBe(2);
    expect(tracked.getCount()).toBe(2);
  });

  test('different functions are cached independently', () => {
    const tracked1 = createTrackedFn();
    const tracked2 = createTrackedFn();
    const mem1 = inst.memoize(tracked1);
    const mem2 = inst.memoize(tracked2);

    mem1(5, 5);
    expect(tracked1.getCount()).toBe(1);
    expect(tracked2.getCount()).toBe(0);

    mem2(5, 5);
    expect(tracked1.getCount()).toBe(1);
    expect(tracked2.getCount()).toBe(1);

    mem1(5, 5);
    mem2(5, 5);
    expect(tracked1.getCount()).toBe(1);
    expect(tracked2.getCount()).toBe(1);
  });

  test('object return values are cached and restored', () => {
    let call = 0;
    const fn = () => {
      call++;
      return { hello: 'world', seq: call };
    };
    const memoized = inst.memoize(fn);

    const r1 = memoized();
    expect(r1).toEqual({ hello: 'world', seq: 1 });
    expect(call).toBe(1);

    const r2 = memoized();
    expect(r2).toEqual({ hello: 'world', seq: 1 });
    expect(call).toBe(1);
  });

  test('array return values are cached and restored', () => {
    let call = 0;
    const fn = () => {
      call++;
      return [1, 2, call];
    };
    const memoized = inst.memoize(fn);

    expect(memoized()).toEqual([1, 2, 1]);
    expect(call).toBe(1);

    expect(memoized()).toEqual([1, 2, 1]);
    expect(call).toBe(1);
  });

  test('string return values are cached', () => {
    let call = 0;
    const fn = (s: string) => {
      call++;
      return s.toUpperCase();
    };
    const memoized = inst.memoize(fn);

    expect(memoized('hello')).toBe('HELLO');
    expect(call).toBe(1);

    expect(memoized('hello')).toBe('HELLO');
    expect(call).toBe(1);

    expect(memoized('world')).toBe('WORLD');
    expect(call).toBe(2);
  });
});
