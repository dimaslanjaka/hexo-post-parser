import crypto from 'crypto';
import fs from 'fs-extra';

/**
 * MD5 file synchronously
 * @param path
 * @returns
 */
export function md5FileSync(path: string) {
  let fileBuffer = Buffer.from(path);
  if (fs.existsSync(path)) {
    if (fs.statSync(path).isFile()) fileBuffer = fs.readFileSync(path);
  }
  const hashSum = crypto.createHash('md5'); // sha256
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * PHP MD5 Equivalent
 * @param data
 * @returns
 */
export function md5(data: string) {
  return crypto.createHash('md5').update(data).digest('hex');
}

export default function md5File(path: string) {
  return new Promise((resolve, reject) => {
    const output = crypto.createHash('md5');
    const input = fs.createReadStream(path);

    input.on('error', (err) => {
      reject(err);
    });

    output.once('readable', () => {
      resolve(output.read().toString('hex'));
    });

    input.pipe(output);
  });
}
