import { build } from "esbuild";

const makeBuild = () =>
  build({
    bundle: true,
    entryPoints: ["./src/index.js"],
    banner: {
      js: "#!/usr/bin/env node",
    },
    platform: "node",
    outfile: "bin",
    format: "cjs",
  });

Promise.all([makeBuild()]);
