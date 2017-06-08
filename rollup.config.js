// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import closure from 'rollup-plugin-closure-compiler-js';
import commonjs from 'rollup-plugin-commonjs';

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
      include: 'node_modules/**',  // Default: undefined

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false,  // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false  // Default: true
    }),
    babel({
      babelrc: false,
      "presets": [
        [
          "es2015", {
            "modules": false
          }
        ],
        "es2016"
      ],
      "plugins": [
        "external-helpers"
      ]
    }),
    closure()
  ],
  dest: 'dist/simmer.js'
};