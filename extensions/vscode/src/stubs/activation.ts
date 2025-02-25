import { EXTENSION_NAME } from "core/control-plane/env";
import * as vscode from "vscode";

import { getUserToken } from "./auth";
import { RemoteConfigSync } from "./remoteConfig";

export async function setupRemoteConfigSync(reloadConfig: () => void) {
<<<<<<< HEAD
  const settings = vscode.workspace.getConfiguration("pearai");
=======
  const settings = vscode.workspace.getConfiguration(EXTENSION_NAME);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  const remoteConfigServerUrl = settings.get<string | null>(
    "remoteConfigServerUrl",
    null,
  );
  if (
    remoteConfigServerUrl === null ||
    remoteConfigServerUrl === undefined ||
    remoteConfigServerUrl.trim() === ""
  ) {
    return;
  }
  getUserToken().then(async (token) => {
    await vscode.workspace
<<<<<<< HEAD
      .getConfiguration("pearai")
=======
      .getConfiguration(EXTENSION_NAME)
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      .update("userToken", token, vscode.ConfigurationTarget.Global);
    try {
      const configSync = new RemoteConfigSync(reloadConfig, token);
      configSync.setup();
    } catch (e) {
      console.warn(`Failed to sync remote config: ${e}`);
    }
  });
}
