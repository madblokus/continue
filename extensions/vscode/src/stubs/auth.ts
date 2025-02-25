import { EXTENSION_NAME } from "core/control-plane/env";
import * as vscode from "vscode";

export async function getUserToken(): Promise<string> {
  // Prefer manual user token first
<<<<<<< HEAD
  const settings = vscode.workspace.getConfiguration("pearai");
=======
  const settings = vscode.workspace.getConfiguration(EXTENSION_NAME);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  const userToken = settings.get<string | null>("userToken", null);
  if (userToken) {
    return userToken;
  }

  const session = await vscode.authentication.getSession("github", [], {
    createIfNone: true,
  });
  return session.accessToken;
}
