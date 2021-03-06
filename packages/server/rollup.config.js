import typescript from "rollup-plugin-typescript2";

const pkg = require("./package.json");

const banner = [].join("\n");
const input = "src/index.ts";
const external = Object.keys(pkg.dependencies)
  .concat(["events", "fs", "os", "path", "https", "url", "crypto"]);

export default [
  // main
  {
    input,
    plugins: [
      typescript({
        check: true,
        clean: true,
        tsconfigOverride: {
          compilerOptions: {
            module: "ES2015",
          }
        },
      }),
    ],
    external,
    output: [
      {
        banner,
        file: pkg.main,
        format: "cjs",
      },
      {
        banner,
        file: pkg.module,
        format: "es",
      },
    ],
  },
];