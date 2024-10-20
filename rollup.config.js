import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import * as glob from 'glob';
import { dts } from 'rollup-plugin-dts';
import packageJson from './package.json' assert { type: 'json' };

const { author, dependencies, devDependencies, name, version } = packageJson;

const external = [
  ...Object.keys(dependencies),
  ...Object.keys(devDependencies)
];

const baseBanner = `// ${name} ${version} by ${author}`.trim();

const esmBanner = `
${baseBanner}

// import { fileURLToPath } from 'url';
// import path from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
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
  external: external, //.filter((pkgName) => !['markdown-it'].includes(pkgName)),
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
    { file: 'dist/index.d.mts', format: 'es', exports: 'named' },
    { file: 'dist/index.d.cts', format: 'es', exports: 'named' }
  ],
  plugins: [resolve({ preferBuiltins: true }), dts()],
  external
};

const _oneFile = [declaration, onefile];

/**
 * @type {import('rollup').RollupOptions['input']}
 */
const inputs = glob.globSync('src/**/*.ts', {
  posix: true,
  ignore: ['*.runner.*', '*.explicit.*', '*.test.*', '*.builder.*', '*.spec.*']
});

/**
 * @type {import('rollup').RollupOptions}
 */
const _partials = {
  input: inputs,
  output: [
    // bundle js as ESM by default
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      exports: 'named',
      globals: {
        hexo: 'hexo'
      }
    },
    // bundle CJS
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: false,
      preserveModules: true,
      exports: 'named',
      entryFileNames: '[name].cjs',
      globals: {
        hexo: 'hexo'
      }
    },
    // bundle mjs as ESM
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      exports: 'named',
      entryFileNames: '[name].mjs',
      globals: {
        hexo: 'hexo'
      }
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
      outDir: './dist',
      include: ['./src/**/*'],
      exclude: [
        '**/*.spec.*',
        '**/*.test.*',
        '**/*.builder.*',
        '**/*.runner.*'
      ],
      declaration: false,
      module: 'ESNext',
      target: 'ESNext'
    }), // Compile TypeScript files
    resolve({ preferBuiltins: true }), // Resolve node_modules packages
    commonjs(), // Convert CommonJS modules to ES6
    babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' })
  ],
  external // External dependencies package name to exclude from bundle
};

export default _oneFile;
