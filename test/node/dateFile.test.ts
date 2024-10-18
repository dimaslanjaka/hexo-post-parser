import { join } from 'path';
import { getModifiedDateOfFile } from '../../src/node/dateFile';

getModifiedDateOfFile(join(__dirname, 'cache.ts')).then(console.log);
