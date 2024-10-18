const { dts } = require('rollup-plugin-dts');
const babel = require('@rollup/plugin-babel').default;
const commonjs = require('@rollup/plugin-commonjs').default;
const resolve = require('@rollup/plugin-node-resolve').default;
const typescript = require('@rollup/plugin-typescript').default;
const pkg = require('./package.json');

const deps = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies)
];
const external = deps.concat('events');

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
      inlineDynamicImports: true
    },
    {
      file: './dist/index.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
      inlineDynamicImports: true
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
    resolve(),
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
  plugins: [dts()],
  external
};

module.exports = [declaration, onefile];
