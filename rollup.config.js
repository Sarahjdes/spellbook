// Rollup config

import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy-glob'
import resolve from 'rollup-plugin-node-resolve'
import postcss from 'postcss'
import postcssCssnext from 'postcss-cssnext'
import riot from 'rollup-plugin-riot'
import sass from 'rollup-plugin-sass'
import { eslint } from 'rollup-plugin-eslint'

/**
 * Transforms new CSS specs into more compatible CSS
 */
function cssnext (tagName, css) {
  // A small hack: it passes :scope as :root to PostCSS.
  // This make it easy to use css variables inside tags.
  css = css.replace(/:scope/g, ':root')
  css = postcss([postcssCssnext]).process(css).css
  css = css.replace(/:root/g, ':scope')
  return css
}

const outputFormat = 'iife'
const plugins = [
  riot({
    style: 'cssnext',
    parsers: {
      css: { cssnext }
    }
  }),
  resolve({
    module: true,  // default: true
    jsnext: true,  // default: false
    main: true,  // default: true
    browser: false,  // default: false
    modulesOnly: false,  // default: false
  }),
  eslint({
    exclude: [
      'src/**/*.{css,sass}',
    ]
  }),
  sass({
    // output: true,
    // output: 'popup.css',
    insert: true
  }),
  commonjs(),
  buble(),
]
const copyOptions = {
  verbose: true,
  watch: true,
  exclude: '**/*.tag'
}

export default [
  {
    input: 'src/popup.js',
    output: {
      file: 'dist/popup.js',
      format: outputFormat,
      sourcemap: true,
      globals: {
        'kefir': 'Kefir',
        'riot': 'riot',
      },
    },
    external: [
      'kefir',
      'riot',
    ],
    plugins: plugins
  },
  {
    input: 'src/background.js',
    output: {
      file: 'dist/background.js',
      format: outputFormat
    },
    plugins: plugins.push(
      copy([
        { files: 'node_modules/kefir/dist/kefir.js', dest: 'dist/external' },
        { files: 'node_modules/riot/riot+compiler.js', dest: 'dist/external' },
        { files: 'src/background.html', dest: 'dist' },
        { files: 'src/icon.png', dest: 'dist' },
        { files: 'src/manifest.json', dest: 'dist' },
        { files: 'src/popup.html', dest: 'dist' },
        // { files: 'src/tags', dest: 'dist' },
      ], copyOptions)
    )
  }
]
