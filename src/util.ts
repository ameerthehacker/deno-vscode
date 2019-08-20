import { existsSync, mkdirSync } from "fs";
import { sep, relative } from "path";
import { tsconfigJSON } from "./tsconfig-json";
import { writeFileSync } from "fs";
import { homedir } from "os";
import { exec } from "child_process";
import { packageJSON } from "./package-json";
import { sync } from "command-exists";
import { settingsJSON } from "./settings-json";

export const isTsconfigExists = (path: string) => {
  if (existsSync(`${path}${sep}tsconfig.json`)) {
    return true;
  } else {
    return false;
  }
};

export const relativePathToDeno = (path: string) => {
  const denoHomeDir = `${homedir}${sep}.deno`;
  let relativePathToDeno = relative(path, denoHomeDir);
  relativePathToDeno = relativePathToDeno.replace(/\\/g, "/");

  return relativePathToDeno;
};

export const createDenoTyping = () => {
  exec(`deno types > ${homedir}${sep}.deno${sep}deno.d.ts`);
};

export const getTsConfigJSONContent = (path: string) => {
  tsconfigJSON.compilerOptions.paths.deno = [
    `${relativePathToDeno(path)}/deno.d.ts`
  ];
  tsconfigJSON.compilerOptions.paths["http://*"] = [
    `${relativePathToDeno(path)}/deps/http/*`
  ];
  tsconfigJSON.compilerOptions.paths["https://*"] = [
    `${relativePathToDeno(path)}/deps/https/*`
  ];

  return JSON.stringify(tsconfigJSON, null, 2);
};

export const getPackageJSONContent = (path: string) => {
  return JSON.stringify(packageJSON, null, 2);
};

export const getSettingsJSONContent = (path: string) => {
  return JSON.stringify(settingsJSON, null, 2);
};

export const createTsConfigJSON = (path: string) => {
  writeFileSync(`${path}${sep}tsconfig.json`, getTsConfigJSONContent(path));
};

export const createPackageJSON = (path: string) => {
  writeFileSync(`${path}${sep}package.json`, getPackageJSONContent(path));
};

export const createSettingsJSON = (path: string) => {
  if (!existsSync(`${path}${sep}.vscode`)) {
    mkdirSync(`${path}${sep}.vscode`);
  }

  writeFileSync(
    `${path}${sep}.vscode${sep}settings.json`,
    getSettingsJSONContent(path)
  );
};

export const initDeno = (vscode: any, path: string) => {
  vscode.w;
  createTsConfigJSON(path);
  createPackageJSON(path);
  createSettingsJSON(path);
  installNodeDep(path).then(() => {
    vscode.window.showInformationMessage(
      "The deno project was initialized successfully, vscode will restart momentarily!"
    );

    setTimeout(() => {
      vscode.commands.executeCommand("workbench.action.reloadWindow");
    }, 3000);
  });
};

export const installNodeDep = (path: string) => {
  return new Promise((resolve, reject) => {
    process.chdir(path);

    if (sync("npm")) {
      exec("npm install").on("close", resolve);
    } else if (sync("yarn")) {
      exec("yarn").on("close", resolve);
    } else {
      resolve();
    }
  });
};
