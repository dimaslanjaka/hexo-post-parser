/// special exports
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// [task] generate empty config if not exists
[
  path.join(__dirname, 'types/_config_project.json'),
  path.join(__dirname, 'types/_config_theme.json'),
  path.join(__dirname, 'types/_config_hashes.json')
].forEach((fpath) => {
  if (!fs.existsSync(fpath)) {
    if (!fs.existsSync(path.dirname(fpath)))
      fs.mkdirSync(path.dirname(fpath), { recursive: true });
    fs.writeFileSync(fpath, '{}');
  }
});
