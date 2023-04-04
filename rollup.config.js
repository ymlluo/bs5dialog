import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
import watch from 'rollup-plugin-watch';
import copy from "rollup-plugin-copy";

export default {
  input: "src/bs5dialog.js",
  output: [
    {
      file: "dist/bs5dialog.js",
      format: "umd",
      name: "bs5dialog",
      sourcemap: false,
      globals: {
        axios: "axios",
        draggabilly: "Draggabilly",
        bootstrap: "bootstrap"
      }
    },
    {
      file: "dist/bs5dialog.cjs.js",
      format: "cjs",
      sourcemap: false,
      globals: {
        axios: "axios",
        draggabilly: "Draggabilly",
        bootstrap: "bootstrap"
      }
    },
    {
      file: "dist/bs5dialog.esm.js",
      format: "esm",
      sourcemap: false,
      globals: {
        axios: "axios",
        draggabilly: "Draggabilly",
        bootstrap: "bootstrap"
      }
    }
  ],
  plugins: [
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
      // modules: true,
      // minimize: true,
    }),
    terser(),
    watch({
      dir: "src"
    }),
    copy({
      targets: [
        { src: "src/index.html", dest: "dist" },
        { src: "src/form.html", dest: "dist" }
      ],
      hook: "buildStart"
    })
  ],
  external: ["axios", "draggabilly", "bootstrap"]
};
