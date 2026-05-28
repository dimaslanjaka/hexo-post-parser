import { test, expect } from '@jest/globals';
import path from 'upath';
import { getModifiedDateOfFile } from '../../src/node/dateFile';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('getModifiedDateOfFile returns mtime and ctime for an existing file', async () => {
  const filePath = __filename; // Use the current test file as the target
  const res = await getModifiedDateOfFile(filePath);

  expect(res).toHaveProperty('mtime');
  expect(res).toHaveProperty('ctime');
  expect(res).toHaveProperty('Data Last Modified');
  expect(res).toHaveProperty('Status Last Modified');

  // Data Last Modified should equal mtime and Status Last Modified should equal ctime
  expect(res['Data Last Modified']).toEqual(res.mtime);
  expect(res['Status Last Modified']).toEqual(res.ctime);
});
