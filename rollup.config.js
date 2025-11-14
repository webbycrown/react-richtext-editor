import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-css-only";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/react-richtext-editor.esm.js",
      format: "esm",
      sourcemap: true,
      exports: "named"
    },
    {
      file: "dist/react-richtext-editor.cjs.js",
      format: "cjs",
      sourcemap: true,
      exports: "named"
    },
  ],
  plugins: [
    resolve({
      extensions: [".js", ".jsx"],
    }),
    commonjs(),
    babel({ 
      presets: ["@babel/preset-env", "@babel/preset-react"],
      babelHelpers: "bundled",
    }),
    css({ output: "styles.css" }),
  ],
  external: ["react", "react-dom"],
};
