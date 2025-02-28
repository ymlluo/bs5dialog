import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
import copy from "rollup-plugin-copy";
import del from 'rollup-plugin-delete';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  input: "src/bs5dialog.js",
  output: [
    {
      file: "dist/bs5dialog.js",
      format: "umd",
      name: "bs5dialog",
      sourcemap: false
    },
    {
      file: "dist/bs5dialog.cjs.js",
      format: "cjs",
      sourcemap: false
    },
    {
      file: "dist/bs5dialog.esm.js",
      format: "esm",
      sourcemap: false
    }
  ],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: false
  },
  plugins: [
    del({ targets: 'dist/*' }),
    nodeResolve(),
    commonjs(),
    json(),
    replace({
      preventAssignment: true,
      "process.browser": true,
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    postcss({
      plugins: [postcssImport()],
      extract: true
    }),
    terser(),
    copy({
      targets: [
        { 
          src: 'src/index.html',
          dest: 'dist/'
        },
        { 
          src: 'src/form.html',
          dest: 'dist/'
        },
        { 
          src: 'src/examples/*',
          dest: 'dist/examples'
        },
        { 
          src: 'src/docs/*',
          dest: 'dist/docs'
        }
      ],
      verbose: true,
      copyOnce: false,
      hook: 'writeBundle'
    })
  ]
};
