// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { isTsconfigExists, createDenoTyping, initDeno } from "./util";
import { sync } from "command-exists";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "deno-vscode" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.denoInit",
    async () => {
      if (!sync("deno")) {
        vscode.window.showErrorMessage(
          "Could not find deno in the path, please ensure that you have installed deno and it is available in the path"
        );

        return;
      }

      // Create deno typings
      createDenoTyping();

      const workspaces = vscode.workspace.workspaceFolders;
      let selectedWorkspace: vscode.WorkspaceFolder | undefined;

      if (workspaces) {
        if (workspaces.length == 1) {
          selectedWorkspace = workspaces[0];
        } else {
          const availableWorkspaces = workspaces.map(
            workspace => workspace.name
          );
          const result = await vscode.window.showQuickPick(
            availableWorkspaces,
            {
              canPickMany: false
            }
          );

          if (result) {
            selectedWorkspace = workspaces.find(
              workspace => workspace.name == result
            );
          }
        }

        if (selectedWorkspace) {
          const selectedWorkspacePath = selectedWorkspace.uri.fsPath;

          try {
            if (!isTsconfigExists(selectedWorkspacePath)) {
              initDeno(vscode, selectedWorkspacePath);
            } else {
              const yesOrNo = ["Yes", "No"];
              const result = await vscode.window.showQuickPick(yesOrNo, {
                canPickMany: false,
                placeHolder:
                  "There is already a tsconfig.json, are you sure to overwrite?"
              });

              if (result === yesOrNo[0]) {
                initDeno(vscode, selectedWorkspacePath);
              }
            }
          } catch (e) {
            vscode.window.showErrorMessage(
              `Could not initialize deno project ${JSON.stringify(e)}`
            );
          }
        } else {
          vscode.window.showErrorMessage("No workspace selected!");
        }
      } else {
        vscode.window.showErrorMessage(
          "No projects found, please open a deno project and try again!"
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
