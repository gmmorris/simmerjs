// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  entry: 'modules/index.js',
  format: 'iife',
  plugins: [
    resolve(),
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
      ],
      exclude: 'node_modules/**' // only transpile our source code
    }),
    closure()
  ],
  dest: 'dist/simmer.js'
};