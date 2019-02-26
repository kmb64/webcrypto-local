import typescript from "rollup-plugin-typescript";
import ts from "typescript";

const pkg = require("./package.json");

const banner = [];
const input = "src/index.ts";
const external = Object.keys(pkg.dependencies)
  .concat(["events", "fs", "os", "path", "https", "url", "crypto"]);

export default [
  // main
  {
    input,
    plugins: [
      typescript({ typescript: ts, target: "esnext", removeComments: true }),
    ],
    external,
    output: [
      {
        banner: banner.join("\n"),
        file: pkg.main,
        format: "cjs",
      }
    ]
  },
  // lib
  {
    input,
    plugins: [
      typescript({ typescript: ts, target: "esnext", removeComments: true }),
    ],
    external,
    output: [
      {
        banner: banner.join("\n"),
        file: pkg.module,
        format: "es",
      }
    ]
  },
];