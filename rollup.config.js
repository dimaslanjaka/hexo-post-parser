const { dts } = require('rollup-plugin-dts');
const babel = require('@rollup/plugin-babel').default;
const commonjs = require('@rollup/plugin-commonjs').default;
const resolve = require('@rollup/plugin-node-resolve').default;
const typescript = require('@rollup/plugin-typescript').default;
const pkg = require('./package.json');

const external = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies)
];

const baseBanner = `// ${pkg.name} ${pkg.version} by ${pkg.author}`.trim();

const esmBanner = `
${baseBanner}

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`.trim();

/**
 * @type {import('rollup').RollupOptions}
 */
const onefile = {
  input: './src/index.ts',
  output: [
    {
      file: './dist/index.js',
      format: 'esm',
      exports: 'named',
      sourcemap: false,
      inlineDynamicImports: true,
      banner: esmBanner
    },
    {
      file: './dist/index.mjs',
      format: 'esm',
      exports: 'named',
      sourcemap: false,
      inlineDynamicImports: true,
      banner: esmBanner
    },
    {
      file: './dist/index.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
      inlineDynamicImports: true,
      banner: baseBanner
    }
  ],
  external: external.filter((pkgName) => !['markdown-it'].includes(pkgName)),
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      outDir: './dist',
      include: ['./src/**/*'],
      exclude: [
        '**/*.spec.*',
        '**/*.test.*',
        '**/*.builder.*',
        '**/*.runner.*'
      ],
      declaration: false
    }),
    resolve({ preferBuiltins: true }),
    commonjs(),
    babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' })
  ]
};

/**
 * @type {import('rollup').RollupOptions}
 */
const declaration = {
  input: './tmp/dist/index.d.ts',
  output: [
    { file: 'dist/index.d.ts', format: 'es', exports: 'named' },
    { file: 'dist/index.d.mts', format: 'es', exports: 'named' }
  ],
  plugins: [resolve({ preferBuiltins: true }), dts()],
  external
};

module.exports = [declaration, onefile];
