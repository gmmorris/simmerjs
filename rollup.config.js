// rollup.config.js
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import closure from '@ampproject/rollup-plugin-closure-compiler'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'modules/index.js',
  output: {
    file: 'dist/simmer.js',
    format: 'cjs'
  },
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
    babel({ babelHelpers: 'bundled' }),
    closure()
  ]
}
