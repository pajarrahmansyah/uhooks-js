import dts from 'rollup-plugin-dts';

import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
      }),
    ],
    external: ["react"],
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
