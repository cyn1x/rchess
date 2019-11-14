import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import image from 'rollup-plugin-image';
import url from 'rollup-plugin-url';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
  input: 'src/index.tsx',
  output: [
     {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true
     },
     {
        file: pkg.module,
        format: 'es',
        exports: 'named',
        sourcemap: true
     }
  ],
  plugins: [
     peerDepsExternal(),
     commonjs(),
     url(),
     resolve(),
     image(),
     postcss({
        modules: false,
        extract: true,
        minimize: true,
        sourceMap: true
     }),
     typescript({
        rollupCommonJSResolveHack: true,
        clean: true,
        exclude: ['src/**/*.test.(tsx|ts)']
     })
  ]
};
