process.cwd = () => __dirname;

import fs from 'fs';
import { join } from 'path';
import yml from 'yaml';
import { setConfig } from '../src';

setConfig(yml.parse(fs.readFileSync(join(__dirname, '_config.yml'), 'utf-8')));
