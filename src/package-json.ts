export const packageJSON = {
  name: "deno-project",
  version: "1.0.0",
  description: "A barebone deno project",
  main: "index.js",
  scripts: {
    test: 'echo "Error: no test specified" && exit 1'
  },
  author: "",
  license: "ISC",
  dependencies: {
    deno_ls_plugin: "^0.1.0",
    typescript: "^3.3.1"
  }
};
