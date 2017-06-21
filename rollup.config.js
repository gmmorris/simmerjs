// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import closure from 'rollup-plugin-closure-compiler-js'
import commonjs from 'rollup-plugin-commonjs'
import fs from 'fs'

const babelrc = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'))

const babelConfig = {
  babelrc: false,
  presets: [['es2015', { modules: false }]].concat(
    (babelrc.presets || []).filter(preset => preset !== 'es2015')
  ),
  plugins: ['external-helpers'].concat(babelrc.plugins || [])
}

export default {
  entry: 'modules/index.js',
  format: 'iife',
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: 'node_modules/**',

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false,

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false
    }),
    babel(babelConfig),
    closure()
  ],
  dest: 'dist/simmer.js'
}
