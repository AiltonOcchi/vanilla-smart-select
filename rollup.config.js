import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `/*!
 * VanillaSmartSelect v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License.
 */`;

export default [
  // UMD build (for browsers via <script>)
  {
    input: 'src/index.browser.js',
    output: {
      file: 'dist/vanilla-smart-select.js',
      format: 'umd',
      name: 'VanillaSmartSelect',
      banner,
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env']
      }),
      postcss({
        extract: 'vanilla-smart-select.css',
        minimize: false,
        sourceMap: true
      })
    ]
  },

  // UMD minified
  {
    input: 'src/index.browser.js',
    output: {
      file: 'dist/vanilla-smart-select.min.js',
      format: 'umd',
      name: 'VanillaSmartSelect',
      banner,
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env']
      }),
      postcss({
        extract: 'vanilla-smart-select.min.css',
        minimize: true,
        sourceMap: true
      }),
      terser({
        format: { comments: /^!/ }
      })
    ]
  },

  // ES Module build (for bundlers)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vanilla-smart-select.esm.js',
      format: 'es',
      banner,
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  },

  // CommonJS build (for Node.js)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vanilla-smart-select.cjs.js',
      format: 'cjs',
      banner,
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  }
];
