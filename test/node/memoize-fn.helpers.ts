import path from 'path';
import memoizer from '../../src/node/memoize-fs';

export function tmpDir(name: string) {
  return path.resolve(process.cwd(), 'tmp', name);
}

export function createMemoizer(dir: string) {
  const inst = new memoizer();
  inst.cacheDir = dir;
  inst.verbose = false;
  return inst;
}

export function createTrackedFn() {
  let count = 0;
  const fn = (a: number, b: number) => {
    count++;
    return a + b;
  };
  fn.getCount = () => count;
  return fn;
}
