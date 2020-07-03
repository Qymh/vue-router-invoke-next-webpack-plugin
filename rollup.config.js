const ts = require('rollup-plugin-typescript2');
const { nodeResolve: rs } = require('@rollup/plugin-node-resolve');
const bt = require('builtin-modules');
const cjs = require('@rollup/plugin-commonjs');

const base = {
  input: 'src/index.ts',
  output: {
    file: 'dist/vue-router-invoke-next-webpack-plugin.js',
    format: 'cjs'
  },
  plugins: [
    cjs(),
    rs({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    ts({
      check: false
    })
  ],
  external: [...bt, 'chalk', 'chokidar', 'fs-extra', 'js-beautify', 'js-yaml']
};

module.exports = base;
