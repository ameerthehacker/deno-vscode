export const tsconfigJSON = {
  compilerOptions: {
    baseUrl: ".",
    allowJs: true,
    checkJs: true,
    esModuleInterop: true,
    module: "esnext",
    moduleResolution: "node",
    noEmit: true,
    noLib: true,
    pretty: true,
    resolveJsonModule: true,
    plugins: [{ name: "deno_ls_plugin" }],
    target: "esnext",
    paths: {
      deno: ["../../../.deno/deno.d.ts"],
      "https://*": ["../../../.deno/deps/https/*"],
      "http://*": ["../../../.deno/deps/http/*"]
    }
  },
  include: ["./**/*.ts"]
};
