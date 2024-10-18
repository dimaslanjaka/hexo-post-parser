const { dts } = require('rollup-plugin-dts');
const babel = require('@rollup/plugin-babel').default;
const commonjs = require('@rollup/plugin-commonjs').default;
const resolve = require('@rollup/plugin-node-resolve').default;
const typescript = require('@rollup/plugin-typescript').default;
const pkg = require('./package.json');
const deps = Object.keys(pkg.dependencies).concat(
  ...Object.keys(pkg.devDependencies)
);

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
  external: ['events']
};

/**
 * @type {import('rollup').RollupOptions}
 */
const onefile = {
  input: './src/index.ts',
  output: [
    {
      file: './dist/index.js',
      format: 'esm',
      exports: 'named'
    },
    {
      file: './dist/index.cjs',
      format: 'cjs',
      exports: 'named'
    }
  ],
  external: deps.concat('events'),
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      outDir: './dist',
      include: ['./src/**/*'],
      exclude: [
        '**/*.spec*.*',
        '**/*.test.*',
        '**/*.builder.*',
        '**/*.runner.*'
      ],
      declaration: false
    }),
    resolve(), // Resolve node_modules
    commonjs(), // Convert CommonJS modules to ES6
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**' // Exclude node_modules from transpilation
    })
  ]
};

module.exports = [declaration, onefile];
