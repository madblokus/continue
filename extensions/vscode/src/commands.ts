/* Note: This file has been modified significantly from its original contents. New commands have been added, and there has been renaming from Continue to PearAI. pearai-submodule is a fork of Continue (https://github.com/continuedev/continue)." */

/* eslint-disable @typescript-eslint/naming-convention */
import * as os from "node:os";

import { ContextMenuConfig, RangeInFileWithContents } from "core";
import { CompletionProvider } from "core/autocomplete/CompletionProvider";
import { ConfigHandler } from "core/config/ConfigHandler";
import { getModelByRole } from "core/config/util";
import { ContinueServerClient } from "core/continueServer/stubs/client";
import { EXTENSION_NAME } from "core/control-plane/env";
import { Core } from "core/core";
import { walkDirAsync } from "core/indexing/walkDir";
import { GlobalContext } from "core/util/GlobalContext";
import { getConfigJsonPath, getDevDataFilePath } from "core/util/paths";
import { Telemetry } from "core/util/posthog";
import readLastLines from "read-last-lines";
import * as vscode from "vscode";

import {
  StatusBarStatus,
  getAutocompleteStatusBarDescription,
  getAutocompleteStatusBarTitle,
  getStatusBarStatus,
  getStatusBarStatusFromQuickPickItemLabel,
  quickPickStatusText,
  setupStatusBar,
} from "./autocomplete/statusBar";
import { ContinueGUIWebviewViewProvider } from "./ContinueGUIWebviewViewProvider";
<<<<<<< HEAD
import { FIRST_LAUNCH_KEY, importUserSettingsFromVSCode, isFirstLaunch } from "./copySettings";
import { DiffManager } from "./diff/horizontal";
import { VerticalPerLineDiffManager } from "./diff/verticalPerLine/manager";
import { QuickEdit, QuickEditShowParams } from "./quickEdit/QuickEditQuickPick";
import { Battery } from "./util/battery";
import { handleIntegrationShortcutKey } from "./util/integrationUtils";
import { getExtensionUri } from "./util/vscode";
import type { VsCodeWebviewProtocol } from "./webviewProtocol";
import { PEARAI_CHAT_VIEW_ID, PEARAI_OVERLAY_VIEW_ID, PEARAI_SEARCH_VIEW_ID } from "./util/pearai/pearaiViewTypes";

=======

import { VerticalDiffManager } from "./diff/vertical/manager";
import EditDecorationManager from "./quickEdit/EditDecorationManager";
import { QuickEdit, QuickEditShowParams } from "./quickEdit/QuickEditQuickPick";
import { Battery } from "./util/battery";
import { VsCodeIde } from "./VsCodeIde";
import { getMetaKeyLabel } from "./util/util";

import type { VsCodeWebviewProtocol } from "./webviewProtocol";
import { startLocalOllama } from "core/util/ollamaHelper";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

let fullScreenPanel: vscode.WebviewPanel | undefined;

function getFullScreenTab() {
  const tabs = vscode.window.tabGroups.all.flatMap((tabGroup) => tabGroup.tabs);
  return tabs.find((tab) =>
    (tab.input as any)?.viewType?.endsWith("pearai.chatView"),
  );
}


type TelemetryCaptureParams = Parameters<typeof Telemetry.capture>;

/**
 * Helper method to add the `isCommandEvent` to all telemetry captures
 */
function captureCommandTelemetry(
  commandName: TelemetryCaptureParams[0],
  properties: TelemetryCaptureParams[1] = {},
) {
  Telemetry.capture(commandName, { isCommandEvent: true, ...properties });
}

function addCodeToContextFromRange(
  range: vscode.Range,
  webviewProtocol: VsCodeWebviewProtocol,
  prompt?: string,
) {
  const document = vscode.window.activeTextEditor?.document;

  if (!document) {
    return;
  }

  const rangeInFileWithContents = {
    filepath: document.uri.toString(),
    contents: document.getText(range),
    range: {
      start: {
        line: range.start.line,
        character: range.start.character,
      },
      end: {
        line: range.end.line,
        character: range.end.character,
      },
    },
  };

  webviewProtocol?.request("highlightedCode", {
    rangeInFileWithContents,
    prompt,
    // Assume `true` since range selection is currently only used for quick actions/fixes
    shouldRun: true,
  }, ["pearai.chatView"]);
}

function getRangeInFileWithContents(
  allowEmpty?: boolean,
  range?: vscode.Range,
): RangeInFileWithContents | null {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const selection = editor.selection;
<<<<<<< HEAD
    if (selection.isEmpty) {
      const rangeInFileWithContents = {
        filepath: editor.document.uri.fsPath,
        contents: "",
        range: {
          start: { line: 0, character: 0, },
          end: { line: 0, character: 0, },
        },
      };

      webviewProtocol?.request("highlightedCode", {
        rangeInFileWithContents,
      }, ["pearai.chatView"]);

      return;
=======
    const filepath = editor.document.uri.toString();

    if (range) {
      const contents = editor.document.getText(range);

      return {
        range: {
          start: {
            line: range.start.line,
            character: range.start.character,
          },
          end: {
            line: range.end.line,
            character: range.end.character,
          },
        },
        filepath,
        contents,
      };
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    }

    if (selection.isEmpty && !allowEmpty) {
      return null;
    }

    // adjust starting position to include indentation
    const start = new vscode.Position(selection.start.line, 0);
    const selectionRange = new vscode.Range(start, selection.end);
    const contents = editor.document.getText(selectionRange);

    return {
      filepath,
      contents,
      range: {
        start: {
          line: selection.start.line,
          character: selection.start.character,
        },
        end: {
          line: selection.end.line,
          character: selection.end.character,
        },
      },
    };
  }

  return null;
}

async function addHighlightedCodeToContext(
  webviewProtocol: VsCodeWebviewProtocol | undefined,
) {
  const rangeInFileWithContents = getRangeInFileWithContents();
  if (rangeInFileWithContents) {
    webviewProtocol?.request("highlightedCode", {
      rangeInFileWithContents,
    }, ["pearai.chatView"]);
  }
}

async function addEntireFileToContext(
  uri: vscode.Uri,
  webviewProtocol: VsCodeWebviewProtocol | undefined,
) {
  // If a directory, add all files in the directory
  const stat = await vscode.workspace.fs.stat(uri);
  if (stat.type === vscode.FileType.Directory) {
    const files = await vscode.workspace.fs.readDirectory(uri);
    for (const [filename, type] of files) {
      if (type === vscode.FileType.File) {
        addEntireFileToContext(
          vscode.Uri.joinPath(uri, filename),
          webviewProtocol,
        );
      }
    }
    return;
  }

  // Get the contents of the file
  const contents = (await vscode.workspace.fs.readFile(uri)).toString();
  const rangeInFileWithContents = {
    filepath: uri.toString(),
    contents: contents,
    range: {
      start: {
        line: 0,
        character: 0,
      },
      end: {
        line: contents.split(os.EOL).length - 1,
        character: 0,
      },
    },
  };

  webviewProtocol?.request("highlightedCode", {
    rangeInFileWithContents,
  }, ["pearai.chatView"]);
}

function focusGUI() {
  const fullScreenTab = getFullScreenTab();
  if (fullScreenTab) {
    // focus fullscreen
    fullScreenPanel?.reveal();
  } else {
    // focus sidebar
    vscode.commands.executeCommand("continue.continueGUIView.focus");
    // vscode.commands.executeCommand("workbench.action.focusAuxiliaryBar");
  }
}

function hideGUI() {
  const fullScreenTab = getFullScreenTab();
  if (fullScreenTab) {
    // focus fullscreen
    fullScreenPanel?.dispose();
  } else {
    // focus sidebar
    vscode.commands.executeCommand("workbench.action.closeAuxiliaryBar");
    // vscode.commands.executeCommand("workbench.action.toggleAuxiliaryBar");
  }
}

async function processDiff(
  action: "accept" | "reject",
  sidebar: ContinueGUIWebviewViewProvider,
  ide: VsCodeIde,
  verticalDiffManager: VerticalDiffManager,
  newFileUri?: string,
  streamId?: string,
) {
  captureCommandTelemetry(`${action}Diff`);

  let newOrCurrentUri = newFileUri;
  if (!newOrCurrentUri) {
    const currentFile = await ide.getCurrentFile();
    newOrCurrentUri = currentFile?.path;
  }
  if (!newOrCurrentUri) {
    console.warn(
      `No file provided or current file open while attempting to resolve diff`,
    );
    return;
  }

  await ide.openFile(newOrCurrentUri);

  // Clear vertical diffs depending on action
  verticalDiffManager.clearForfileUri(newOrCurrentUri, action === "accept");

  void sidebar.webviewProtocol.request("setEditStatus", {
    status: "done",
  });

  if (streamId) {
    const fileContent = await ide.readFile(newOrCurrentUri);

    await sidebar.webviewProtocol.request("updateApplyState", {
      fileContent,
      filepath: newOrCurrentUri,
      streamId,
      status: "closed",
      numDiffs: 0,
    });
  }

  if (action === "accept") {
    await sidebar.webviewProtocol.request("exitEditMode", undefined);
  }
}

function waitForSidebarReady(
  sidebar: ContinueGUIWebviewViewProvider,
  timeout: number,
  interval: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const checkReadyState = () => {
      if (sidebar.isReady) {
        resolve(true);
      } else if (Date.now() - startTime >= timeout) {
        resolve(false); // Timed out
      } else {
        setTimeout(checkReadyState, interval);
      }
    };

    checkReadyState();
  });
}

// Copy everything over from extension.ts
const getCommandsMap: (
  ide: VsCodeIde,
  extensionContext: vscode.ExtensionContext,
  sidebar: ContinueGUIWebviewViewProvider,
  configHandler: ConfigHandler,
  verticalDiffManager: VerticalDiffManager,
  continueServerClientPromise: Promise<ContinueServerClient>,
  battery: Battery,
  quickEdit: QuickEdit,
  core: Core,
  editDecorationManager: EditDecorationManager,
) => { [command: string]: (...args: any) => any } = (
  ide,
  extensionContext,
  sidebar,
  configHandler,
  verticalDiffManager,
  continueServerClientPromise,
  battery,
  quickEdit,
  core,
  editDecorationManager,
) => {
  /**
   * Streams an inline edit to the vertical diff manager.
   *
   * This function retrieves the configuration, determines the appropriate model title,
   * increments the FTC count, and then streams an edit to the
   * vertical diff manager.
   *
   * @param  promptName - The key for the prompt in the context menu configuration.
   * @param  fallbackPrompt - The prompt to use if the configured prompt is not available.
   * @param  [onlyOneInsertion] - Optional. If true, only one insertion will be made.
   * @param  [range] - Optional. The range to edit if provided.
   * @returns
   */
  async function streamInlineEdit(
    promptName: keyof ContextMenuConfig,
    fallbackPrompt: string,
    onlyOneInsertion?: boolean,
    range?: vscode.Range,
  ) {
    const { config } = await configHandler.loadConfig();
    if (!config) {
      throw new Error("Config not loaded");
    }

    const defaultModelTitle = await sidebar.webviewProtocol.request(
      "getDefaultModelTitle",
      undefined,
    );

    const modelTitle =
      getModelByRole(config, "inlineEdit")?.title ?? defaultModelTitle;

    void sidebar.webviewProtocol.request("incrementFtc", undefined);

    await verticalDiffManager.streamEdit(
      config.experimental?.contextMenuPrompts?.[promptName] ?? fallbackPrompt,
      modelTitle,
      undefined,
      onlyOneInsertion,
      undefined,
      range,
    );
  }
  return {
<<<<<<< HEAD
    "pearai.openPearAiWelcome": async () => {
      vscode.commands.executeCommand(
        "markdown.showPreview",
        vscode.Uri.file(
          path.join(getExtensionUri().fsPath, "media", "welcome.md"),
        ),
      );
    },
    "pearai.welcome.importUserSettingsFromVSCode": async () => {
      if (!isFirstLaunch(extensionContext)) {
        vscode.window.showInformationMessage("Welcome back! User settings import is skipped as this is not the first launch.");
        console.dir("Extension launch detected as a subsequent launch. Skipping user settings import.");
        return true;
      }
      return await importUserSettingsFromVSCode();
    },
    "pearai.welcome.markNewOnboardingComplete": async () => {
      await extensionContext.globalState.update(FIRST_LAUNCH_KEY, true);
      await vscode.commands.executeCommand('pearai.unlockOverlay');
      await vscode.commands.executeCommand('pearai.hideOverlay');
    },
    "pearai.restFirstLaunchInGUI": async () => {
      sidebar.webviewProtocol?.request("restFirstLaunchInGUI", undefined, [PEARAI_CHAT_VIEW_ID]);
    },
    "pearai.showInteractiveContinueTutorial": async () => {
      sidebar.webviewProtocol?.request("showInteractiveContinueTutorial", undefined, [PEARAI_CHAT_VIEW_ID]);
    },
    "pearai.highlightElement": async (msg) => {
      vscode.commands.executeCommand("pearai.highlightElements", msg.data.elementSelectors);
    },
    "pearai.unhighlightElement": async (msg) => {
      vscode.commands.executeCommand("pearai.removeHighlight", msg.data.elementSelectors);
    },
    "pearai.acceptDiff": async (newFilepath?: string | vscode.Uri) => {
      captureCommandTelemetry("acceptDiff");

      if (newFilepath instanceof vscode.Uri) {
        newFilepath = newFilepath.fsPath;
      }
      verticalDiffManager.clearForFilepath(newFilepath, true);
      await diffManager.acceptDiff(newFilepath);
    },
    "pearai.rejectDiff": async (newFilepath?: string | vscode.Uri) => {
      captureCommandTelemetry("rejectDiff");

      if (newFilepath instanceof vscode.Uri) {
        newFilepath = newFilepath.fsPath;
      }
      verticalDiffManager.clearForFilepath(newFilepath, false);
      await diffManager.rejectDiff(newFilepath);
    },
    "pearai.acceptVerticalDiffBlock": (filepath?: string, index?: number) => {
=======
    "continue.acceptDiff": async (newFileUri?: string, streamId?: string) =>
      processDiff(
        "accept",
        sidebar,
        ide,
        verticalDiffManager,
        newFileUri,
        streamId,
      ),

    "continue.rejectDiff": async (newFilepath?: string, streamId?: string) =>
      processDiff(
        "reject",
        sidebar,
        ide,
        verticalDiffManager,
        newFilepath,
        streamId,
      ),
    "continue.acceptVerticalDiffBlock": (fileUri?: string, index?: number) => {
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      captureCommandTelemetry("acceptVerticalDiffBlock");
      verticalDiffManager.acceptRejectVerticalDiffBlock(true, fileUri, index);
    },
<<<<<<< HEAD
    "pearai.rejectVerticalDiffBlock": (filepath?: string, index?: number) => {
=======
    "continue.rejectVerticalDiffBlock": (fileUri?: string, index?: number) => {
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      captureCommandTelemetry("rejectVerticalDiffBlock");
      verticalDiffManager.acceptRejectVerticalDiffBlock(false, fileUri, index);
    },
    "pearai.quickFix": async (
      range: vscode.Range,
      diagnosticMessage: string,
    ) => {
      captureCommandTelemetry("quickFix");

      const prompt = `Please explain the cause of this error and how to solve it: ${diagnosticMessage}`;

      addCodeToContextFromRange(range, sidebar.webviewProtocol, prompt);

      vscode.commands.executeCommand("pearai.focusContinueInput");
    },
    // Passthrough for telemetry purposes
    "pearai.defaultQuickAction": async (args: QuickEditShowParams) => {
      captureCommandTelemetry("defaultQuickAction");
<<<<<<< HEAD
      vscode.commands.executeCommand("pearai.quickEdit", args);
=======
      vscode.commands.executeCommand("continue.focusEdit", args);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    },
    "pearai.customQuickActionSendToChat": async (
      prompt: string,
      range: vscode.Range,
    ) => {
      captureCommandTelemetry("customQuickActionSendToChat");

      addCodeToContextFromRange(range, sidebar.webviewProtocol, prompt);

      vscode.commands.executeCommand("pearai.chatView.focus");
    },
    "pearai.customQuickActionStreamInlineEdit": async (
      prompt: string,
      range: vscode.Range,
    ) => {
      captureCommandTelemetry("customQuickActionStreamInlineEdit");

      streamInlineEdit("docstring", prompt, false, range);
    },
<<<<<<< HEAD
    "pearai.toggleAuxiliaryBar": () => {
      vscode.commands.executeCommand("workbench.action.toggleAuxiliaryBar");
    },
    "pearai.codebaseForceReIndex": async () => {
      core.invoke("index/forceReIndex", undefined);
    },
    "pearai.docsIndex": async () => {
=======
    "continue.codebaseForceReIndex": async () => {
      core.invoke("index/forceReIndex", undefined);
    },
    "continue.rebuildCodebaseIndex": async () => {
      core.invoke("index/forceReIndex", { shouldClearIndexes: true });
    },
    "continue.docsIndex": async () => {
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      core.invoke("context/indexDocs", { reIndex: false });
    },
    "pearai.docsReIndex": async () => {
      core.invoke("context/indexDocs", { reIndex: true });
    },
<<<<<<< HEAD
    "pearai.toggleSearch": async () => {
      await handleIntegrationShortcutKey("navigateToSearch", "perplexityMode", sidebar, [PEARAI_OVERLAY_VIEW_ID]);
    },
    "pearai.toggleMem0": async () => {
      await handleIntegrationShortcutKey("navigateToMem0", "mem0Mode", sidebar, [PEARAI_OVERLAY_VIEW_ID]);
    },
    "pearai.toggleInventorySettings": async () => {
      await handleIntegrationShortcutKey("toggleInventorySettings", "inventory", sidebar, [PEARAI_OVERLAY_VIEW_ID]);
      vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
    },
    "pearai.toggleInventoryHome": async () => {
      await handleIntegrationShortcutKey("navigateToInventoryHome", "home", sidebar, [PEARAI_OVERLAY_VIEW_ID, PEARAI_CHAT_VIEW_ID]);
    },
    "pearai.startOnboarding": async () => {
      if (isFirstLaunch(extensionContext)) {
        setTimeout(() => {
          core.invoke("index/setPaused", true);
        }, 200);
        setTimeout(async () => {
          core.invoke("index/setPaused", false);
        }, 6000);
      }
      await vscode.commands.executeCommand("pearai.showOverlay");
      await vscode.commands.executeCommand("pearai.showInteractiveContinueTutorial");
    },
    "pearai.developer.restFirstLaunch": async () => {
      vscode.commands.executeCommand("pearai.restFirstLaunchInGUI");
      extensionContext.globalState.update(FIRST_LAUNCH_KEY, false);
      vscode.window.showInformationMessage("Successfully reset PearAI first launch flag, RELOAD WINDOW TO SEE WELCOME PAGE", 'Reload Window')
        .then(selection => {
          if (selection === 'Reload Window') {
            vscode.commands.executeCommand('workbench.action.reloadWindow');
          }
        });
      console.log("FIRST PEARAI LAUNCH FLAG RESET");
    },
    "pearai.focusAgentView": async () => {
      try {
        vscode.commands.executeCommand('workbench.action.switchToPearAIIntegrationIconBar', { view: 'agent' });
      } catch (e) {
        console.error("Failed to focus pearai-roo-cline sidebar:", e);
      }
      vscode.commands.executeCommand("pearai-roo-cline.SidebarProvider.focus");

    },
    "pearai.focusPearAIMem0View": async () => {
      try {
        vscode.commands.executeCommand('workbench.action.switchToPearAIIntegrationIconBar', { view: 'memory' });
      } catch (e) {
        console.error("Failed to focus pearai-roo-cline sidebar:", e);
      }
      vscode.commands.executeCommand("pearai.mem0View.focus");
    },
    "pearai.focusPearAISearchView": async () => {
      try {
        vscode.commands.executeCommand('workbench.action.switchToPearAIIntegrationIconBar', { view: 'search' });
      } catch (e) {
        console.error("Failed to focus pearai-roo-cline sidebar:", e);
      }
      vscode.commands.executeCommand("pearai.searchView.focus");
    },
    "pearai.focusContinueInput": async () => {
      try {
        vscode.commands.executeCommand('workbench.action.switchToPearAIIntegrationIconBar', { view: 'chat' });
      } catch (e) {
        console.error("Failed to focus pearai-roo-cline sidebar:", e);
      }
      const fullScreenTab = getFullScreenTab();
      if (!fullScreenTab) {
        // focus sidebar
        vscode.commands.executeCommand("pearai.chatView.focus");
      } else {
        // focus fullscreen
        fullScreenPanel?.reveal();
      }
      sidebar.webviewProtocol?.request("focusContinueInput", undefined, ["pearai.chatView"]);
      await addHighlightedCodeToContext(sidebar.webviewProtocol);
    },
    "pearai.focusContinueInputWithoutClear": async () => {
      try {
        vscode.commands.executeCommand('workbench.action.switchToPearAIIntegrationIconBar', { view: 'chat' });
      } catch (e) {
        console.error("Failed to focus pearai-roo-cline sidebar:", e);
      }
      const fullScreenTab = getFullScreenTab();

=======
    "continue.focusContinueInput": async () => {
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      const isContinueInputFocused = await sidebar.webviewProtocol.request(
        "isContinueInputFocused",
        undefined,
        false,
      );

      // This is a temporary fix—sidebar.webviewProtocol.request is blocking
      // when the GUI hasn't yet been setup and we should instead be
      // immediately throwing an error, or returning a Result object
      focusGUI();
      if (!sidebar.isReady) {
        const isReady = await waitForSidebarReady(sidebar, 5000, 100);
        if (!isReady) {
          return;
        }
      }

      const historyLength = await sidebar.webviewProtocol.request(
        "getWebviewHistoryLength",
        undefined,
        false,
      );

      if (isContinueInputFocused) {
        if (historyLength === 0) {
          hideGUI();
        } else {
          void sidebar.webviewProtocol?.request(
            "focusContinueInputWithNewSession",
            undefined,
            false,
          );
        }
      } else {
<<<<<<< HEAD
        // Handle opening the GUI otherwise
        if (!fullScreenTab) {
          // focus sidebar
          vscode.commands.executeCommand("pearai.chatView.focus");
        } else {
          // focus fullscreen
          fullScreenPanel?.reveal();
=======
        focusGUI();
        sidebar.webviewProtocol?.request(
          "focusContinueInputWithNewSession",
          undefined,
          false,
        );
        void addHighlightedCodeToContext(sidebar.webviewProtocol);
      }
    },
    "continue.focusContinueInputWithoutClear": async () => {
      const isContinueInputFocused = await sidebar.webviewProtocol.request(
        "isContinueInputFocused",
        undefined,
        false,
      );

      // This is a temporary fix—sidebar.webviewProtocol.request is blocking
      // when the GUI hasn't yet been setup and we should instead be
      // immediately throwing an error, or returning a Result object
      focusGUI();
      if (!sidebar.isReady) {
        const isReady = await waitForSidebarReady(sidebar, 5000, 100);
        if (!isReady) {
          return;
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        }
      }

      if (isContinueInputFocused) {
        hideGUI();
      } else {
        focusGUI();

        sidebar.webviewProtocol?.request(
          "focusContinueInputWithoutClear",
          undefined,
        );

        void addHighlightedCodeToContext(sidebar.webviewProtocol);
      }
    },
<<<<<<< HEAD
    "pearai.quickEdit": async (args: QuickEditShowParams) => {
      captureCommandTelemetry("quickEdit");
      quickEdit.show(args);
      sidebar.webviewProtocol?.request("quickEdit", undefined, [PEARAI_CHAT_VIEW_ID]);
    },
    "pearai.writeCommentsForCode": async () => {
=======
    // QuickEditShowParams are passed from CodeLens, temp fix
    // until we update to new params specific to Edit
    "continue.focusEdit": async (args?: QuickEditShowParams) => {
      captureCommandTelemetry("focusEdit");
      focusGUI();

      sidebar.webviewProtocol?.request("focusEdit", undefined);

      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      const existingDiff = verticalDiffManager.getHandlerForFile(
        editor.document.fileName,
      );

      // If there's a diff currently being applied, then we just toggle focus back to the input
      if (existingDiff) {
        sidebar.webviewProtocol?.request("focusContinueInput", undefined);
        return;
      }

      const range =
        args?.range ??
        new vscode.Range(editor.selection.start, editor.selection.end);

      editDecorationManager.setDecoration(editor, range);

      const rangeInFileWithContents = getRangeInFileWithContents(true, range);

      if (rangeInFileWithContents) {
        sidebar.webviewProtocol?.request(
          "addCodeToEdit",
          rangeInFileWithContents,
        );

        // Un-select the current selection
        editor.selection = new vscode.Selection(
          editor.selection.anchor,
          editor.selection.anchor,
        );
      }
    },
    "continue.focusEditWithoutClear": async () => {
      captureCommandTelemetry("focusEditWithoutClear");
      focusGUI();

      sidebar.webviewProtocol?.request("focusEditWithoutClear", undefined);

      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      const document = editor.document;

      const existingDiff = verticalDiffManager.getHandlerForFile(
        document.fileName,
      );

      // If there's a diff currently being applied, then we just toggle focus back to the input
      if (existingDiff) {
        sidebar.webviewProtocol?.request("focusContinueInput", undefined);
        return;
      }

      const rangeInFileWithContents = getRangeInFileWithContents(false);

      if (rangeInFileWithContents) {
        sidebar.webviewProtocol?.request(
          "addCodeToEdit",
          rangeInFileWithContents,
        );
      } else {
        const contents = document.getText();

        sidebar.webviewProtocol?.request("addCodeToEdit", {
          filepath: document.uri.toString(),
          contents,
        });
      }
    },
    "continue.exitEditMode": async () => {
      captureCommandTelemetry("exitEditMode");
      editDecorationManager.clear();
      void sidebar.webviewProtocol?.request("exitEditMode", undefined);
    },
    // "continue.quickEdit": async (args: QuickEditShowParams) => {
    //   let linesOfCode = undefined;
    //   if (args.range) {
    //     linesOfCode = args.range.end.line - args.range.start.line;
    //   }
    //   captureCommandTelemetry("quickEdit", {
    //     linesOfCode,
    //   });
    //   quickEdit.show(args);
    // },
    "continue.writeCommentsForCode": async () => {
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      captureCommandTelemetry("writeCommentsForCode");

      streamInlineEdit(
        "comment",
        "Write comments for this code. Do not change anything about the code itself.",
      );
    },
    "pearai.writeDocstringForCode": async () => {
      captureCommandTelemetry("writeDocstringForCode");

      streamInlineEdit(
        "docstring",
        "Write a docstring for this code. Do not change anything about the code itself.",
        true,
      );
    },
    "pearai.fixCode": async () => {
      captureCommandTelemetry("fixCode");

      streamInlineEdit(
        "fix",
        "Fix this code. If it is already 100% correct, simply rewrite the code.",
      );
    },
    "pearai.optimizeCode": async () => {
      captureCommandTelemetry("optimizeCode");
      streamInlineEdit("optimize", "Optimize this code");
    },
    "pearai.fixGrammar": async () => {
      captureCommandTelemetry("fixGrammar");
      streamInlineEdit(
        "fixGrammar",
        "If there are any grammar or spelling mistakes in this writing, fix them. Do not make other large changes to the writing.",
      );
    },
    "pearai.viewLogs": async () => {
      captureCommandTelemetry("viewLogs");
<<<<<<< HEAD

      // Open ~/.pearai/pearai.log
      const logFile = path.join(os.homedir(), ".pearai", "pearai.log");
      // Make sure the file/directory exist
      if (!fs.existsSync(logFile)) {
        fs.mkdirSync(path.dirname(logFile), { recursive: true });
        fs.writeFileSync(logFile, "");
      }

      const uri = vscode.Uri.file(logFile);
      await vscode.window.showTextDocument(uri);
=======
      vscode.commands.executeCommand("workbench.action.toggleDevTools");
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    },
    "pearai.debugTerminal": async () => {
      captureCommandTelemetry("debugTerminal");

      const terminalContents = await ide.getTerminalContents();

      vscode.commands.executeCommand("pearai.chatView.focus");

      sidebar.webviewProtocol?.request("userInput", {
        input: `I got the following error, can you please help explain how to fix it?\n\n${terminalContents.trim()}`,
      }, ["pearai.chatView"]);
    },
    "pearai.hideInlineTip": () => {
      vscode.workspace
<<<<<<< HEAD
        .getConfiguration("pearai")
=======
        .getConfiguration(EXTENSION_NAME)
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        .update("showInlineTip", false, vscode.ConfigurationTarget.Global);
    },

    // Commands without keyboard shortcuts
    "pearai.addModel": () => {
      captureCommandTelemetry("addModel");

      vscode.commands.executeCommand("pearai.chatView.focus");
      sidebar.webviewProtocol?.request("addModel", undefined, ["pearai.chatView"]);
    },
<<<<<<< HEAD
    "pearai.openSettingsUI": () => {
      vscode.commands.executeCommand("pearai.chatView.focus");
      sidebar.webviewProtocol?.request("openSettings", undefined, ["pearai.chatView"]);
    },
    "pearai.sendMainUserInput": (text: string) => {
=======
    "continue.sendMainUserInput": (text: string) => {
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      sidebar.webviewProtocol?.request("userInput", {
        input: text,
      });
    },
    "pearai.selectRange": (startLine: number, endLine: number) => {
      if (!vscode.window.activeTextEditor) {
        return;
      }
      vscode.window.activeTextEditor.selection = new vscode.Selection(
        startLine,
        0,
        endLine,
        0,
      );
    },
    "pearai.foldAndUnfold": (
      foldSelectionLines: number[],
      unfoldSelectionLines: number[],
    ) => {
      vscode.commands.executeCommand("editor.unfold", {
        selectionLines: unfoldSelectionLines,
      });
      vscode.commands.executeCommand("editor.fold", {
        selectionLines: foldSelectionLines,
      });
    },
    "pearai.sendToTerminal": (text: string) => {
      captureCommandTelemetry("sendToTerminal");
      ide.runCommand(text);
    },
    // Note: Unfortunately I don't see a way to get the view ID passed in as an argument here from package.json, so this is what I have for now -@nang-149
    "pearai.newSession": async () => {
      sidebar.webviewProtocol?.request("newSession", undefined, [PEARAI_CHAT_VIEW_ID]);
      const currentFile = await ide.getCurrentFile();
      sidebar.webviewProtocol?.request("setActiveFilePath", currentFile, [PEARAI_CHAT_VIEW_ID]);
    },
<<<<<<< HEAD
    "pearai.newSessionSearch": async () => {
      sidebar.webviewProtocol?.request("newSessionSearch", undefined, [PEARAI_SEARCH_VIEW_ID]);
      const currentFile = await ide.getCurrentFile();
      sidebar.webviewProtocol?.request("setActiveFilePath", currentFile, [PEARAI_SEARCH_VIEW_ID]);
    },
    "pearai.viewHistory": () => {
      sidebar.webviewProtocol?.request("viewHistory", undefined, [
        PEARAI_CHAT_VIEW_ID,
      ]);
    },
    "pearai.viewHistorySearch": () => {
      sidebar.webviewProtocol?.request("viewHistory", undefined, [
        PEARAI_SEARCH_VIEW_ID,
      ]);
    },
    "pearai.toggleFullScreen": () => {
=======
    "continue.viewHistory": () => {
      vscode.commands.executeCommand("continue.navigateTo", "/history", true);
    },
    "continue.focusContinueSessionId": async (
      sessionId: string | undefined,
    ) => {
      if (!sessionId) {
        sessionId = await vscode.window.showInputBox({
          prompt: "Enter the Session ID",
        });
      }
      void sidebar.webviewProtocol?.request("focusContinueSessionId", {
        sessionId,
      });
    },
    "continue.applyCodeFromChat": () => {
      void sidebar.webviewProtocol.request("applyCodeFromChat", undefined);
    },
    "continue.toggleFullScreen": async () => {
      focusGUI();

      const sessionId = await sidebar.webviewProtocol.request(
        "getCurrentSessionId",
        undefined,
      );
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      // Check if full screen is already open by checking open tabs
      const fullScreenTab = getFullScreenTab();

      if (fullScreenTab && fullScreenPanel) {
        // Full screen open, but not focused - focus it
        fullScreenPanel.reveal();
        return;
      }

      // Clear the sidebar to prevent overwriting changes made in fullscreen
      vscode.commands.executeCommand("continue.newSession");

      // Full screen not open - open it
      captureCommandTelemetry("openFullScreen");

      // Create the full screen panel
      let panel = vscode.window.createWebviewPanel(
        "pearai.chatViewFullscreen",
        "PearAI",
        vscode.ViewColumn.One,
        {
          retainContextWhenHidden: true,
          enableScripts: true,
        },
      );
      fullScreenPanel = panel;

      // Add content to the panel
      panel.webview.html = sidebar.getSidebarContent(
        extensionContext,
        panel,
        undefined,
        undefined,
        true,
      );

      const sessionLoader = panel.onDidChangeViewState(() => {
        vscode.commands.executeCommand("continue.newSession");
        if (sessionId) {
          vscode.commands.executeCommand(
            "continue.focusContinueSessionId",
            sessionId,
          );
        }
        panel.reveal();
        sessionLoader.dispose();
      });

      // When panel closes, reset the webview and focus
      panel.onDidDispose(
        () => {
          sidebar.resetWebviewProtocolWebview();
          vscode.commands.executeCommand("pearai.focusContinueInput");
        },
        null,
        extensionContext.subscriptions,
      );

      vscode.commands.executeCommand("workbench.action.copyEditorToNewWindow");
      vscode.commands.executeCommand("workbench.action.closeAuxiliaryBar");
    },
<<<<<<< HEAD
    "pearai.perplexityMode": async () => {
      await handleIntegrationShortcutKey("navigateToSearch", "perplexityMode", sidebar, [PEARAI_OVERLAY_VIEW_ID]);
    },
    "pearai.addPerplexityContext": (msg) => {
      const fullScreenTab = getFullScreenTab();
      if (!fullScreenTab) {
        // focus sidebar
        vscode.commands.executeCommand("pearai.chatView.focus");
      }
      sidebar.webviewProtocol?.request("addPerplexityContextinChat", msg.data, ["pearai.chatView"]);
    },
    "pearai.openConfigJson": () => {
      ide.openFile(getConfigJsonPath());
    },
    "pearai.selectFilesAsContext": (
      firstUri: vscode.Uri,
      uris: vscode.Uri[],
    ) => {
      vscode.commands.executeCommand("pearai.chatView.focus");
=======
    "continue.openConfigPage": () => {
      vscode.commands.executeCommand("continue.navigateTo", "/config", true);
    },
    "continue.selectFilesAsContext": async (
      firstUri: vscode.Uri,
      uris: vscode.Uri[],
    ) => {
      if (uris === undefined) {
        throw new Error("No files were selected");
      }

      vscode.commands.executeCommand("continue.continueGUIView.focus");
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

      for (const uri of uris) {
        // If it's a folder, add the entire folder contents recursively by using walkDir (to ignore ignored files)
        const isDirectory = await vscode.workspace.fs
          .stat(uri)
          ?.then((stat) => stat.type === vscode.FileType.Directory);
        if (isDirectory) {
          for await (const fileUri of walkDirAsync(uri.toString(), ide)) {
            addEntireFileToContext(
              vscode.Uri.parse(fileUri),
              sidebar.webviewProtocol,
            );
          }
        } else {
          addEntireFileToContext(uri, sidebar.webviewProtocol);
        }
      }
    },
    "pearai.logAutocompleteOutcome": (
      completionId: string,
      completionProvider: CompletionProvider,
    ) => {
      completionProvider.accept(completionId);
    },
    "pearai.toggleTabAutocompleteEnabled": () => {
      captureCommandTelemetry("toggleTabAutocompleteEnabled");

<<<<<<< HEAD
      const config = vscode.workspace.getConfiguration("pearai");
=======
      const config = vscode.workspace.getConfiguration(EXTENSION_NAME);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      const enabled = config.get("enableTabAutocomplete");
      const pauseOnBattery = config.get<boolean>(
        "pauseTabAutocompleteOnBattery",
      );
      if (!pauseOnBattery || battery.isACConnected()) {
        config.update(
          "enableTabAutocomplete",
          !enabled,
          vscode.ConfigurationTarget.Global,
        );
      } else {
        if (enabled) {
          const paused = getStatusBarStatus() === StatusBarStatus.Paused;
          if (paused) {
            setupStatusBar(StatusBarStatus.Enabled);
          } else {
            config.update(
              "enableTabAutocomplete",
              false,
              vscode.ConfigurationTarget.Global,
            );
          }
        } else {
          setupStatusBar(StatusBarStatus.Paused);
          config.update(
            "enableTabAutocomplete",
            true,
            vscode.ConfigurationTarget.Global,
          );
        }
      }
    },
    "pearai.openTabAutocompleteConfigMenu": async () => {
      captureCommandTelemetry("openTabAutocompleteConfigMenu");

<<<<<<< HEAD
      const config = vscode.workspace.getConfiguration("pearai");
=======
      const config = vscode.workspace.getConfiguration(EXTENSION_NAME);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      const quickPick = vscode.window.createQuickPick();
      const autocompleteModels =
        (await configHandler.loadConfig()).config?.tabAutocompleteModels ?? [];

      let selected = new GlobalContext().get("selectedTabAutocompleteModel");
      if (
        !selected ||
        !autocompleteModels.some((model) => model.title === selected)
      ) {
        selected = autocompleteModels[0]?.title;
      }

      // Toggle between Disabled, Paused, and Enabled
      const pauseOnBattery =
        config.get<boolean>("pauseTabAutocompleteOnBattery") &&
        !battery.isACConnected();
      const currentStatus = getStatusBarStatus();

      let targetStatus: StatusBarStatus | undefined;
      if (pauseOnBattery) {
        // Cycle from Disabled -> Paused -> Enabled
        targetStatus =
          currentStatus === StatusBarStatus.Paused
            ? StatusBarStatus.Enabled
            : currentStatus === StatusBarStatus.Disabled
              ? StatusBarStatus.Paused
              : StatusBarStatus.Disabled;
      } else {
        // Toggle between Disabled and Enabled
        targetStatus =
          currentStatus === StatusBarStatus.Disabled
            ? StatusBarStatus.Enabled
            : StatusBarStatus.Disabled;
      }

      quickPick.items = [
        {
          label: "$(question) Open help center",
        },
        {
          label: "$(comment) Open chat",
          description: getMetaKeyLabel() + " + L",
        },
        {
          label: "$(screen-full) Open full screen chat",
          description:
            getMetaKeyLabel() + " + K, " + getMetaKeyLabel() + " + M",
        },
        {
          label: quickPickStatusText(targetStatus),
        },
        {
          label: "$(gear) Configure autocomplete options",
        },
        {
          label: "$(feedback) Give feedback",
        },
        {
          kind: vscode.QuickPickItemKind.Separator,
          label: "Switch model",
        },
        ...autocompleteModels.map((model) => ({
          label: getAutocompleteStatusBarTitle(selected, model),
          description: getAutocompleteStatusBarDescription(selected, model),
        })),
      ];
      quickPick.onDidAccept(() => {
        const selectedOption = quickPick.selectedItems[0].label;
        const targetStatus =
          getStatusBarStatusFromQuickPickItemLabel(selectedOption);

        if (targetStatus !== undefined) {
          setupStatusBar(targetStatus);
          config.update(
            "enableTabAutocomplete",
            targetStatus === StatusBarStatus.Enabled,
            vscode.ConfigurationTarget.Global,
          );
        } else if (
          selectedOption === "$(gear) Configure autocomplete options"
        ) {
          ide.openFile(vscode.Uri.file(getConfigJsonPath()).toString());
        } else if (
          autocompleteModels.some((model) => model.title === selectedOption)
        ) {
          new GlobalContext().update(
            "selectedTabAutocompleteModel",
            selectedOption,
          );
          configHandler.reloadConfig();
        } else if (selectedOption === "$(feedback) Give feedback") {
<<<<<<< HEAD
          vscode.commands.executeCommand("pearai.giveAutocompleteFeedback");
=======
          vscode.commands.executeCommand("continue.giveAutocompleteFeedback");
        } else if (selectedOption === "$(comment) Open chat (Cmd+L)") {
          vscode.commands.executeCommand("continue.focusContinueInput");
        } else if (
          selectedOption ===
          "$(screen-full) Open full screen chat (Cmd+K Cmd+M)"
        ) {
          vscode.commands.executeCommand("continue.toggleFullScreen");
        } else if (selectedOption === "$(question) Open help center") {
          focusGUI();
          vscode.commands.executeCommand("continue.navigateTo", "/more", true);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        }
        quickPick.dispose();
      });
      quickPick.show();
    },
    "pearai.giveAutocompleteFeedback": async () => {
      const feedback = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        prompt:
          "Please share what went wrong with the last completion. The details of the completion as well as this message will be sent to PearAI in order to improve.",
      });
      if (feedback) {
        const client = await continueServerClientPromise;
        const completionsPath = getDevDataFilePath("autocomplete");

        const lastLines = await readLastLines.read(completionsPath, 2);
        client.sendFeedback(feedback, lastLines);
      }
    },
<<<<<<< HEAD
    "pearai.debug2": async () => {
      const extensionUrl = `${vscode.env.uriScheme}://pearai.pearai/auth?token=TOKEN&refresh=REFRESH`;
      const extensionUrlParsed = vscode.Uri.parse(extensionUrl);
      const callbackUri = await vscode.env.asExternalUri(
        vscode.Uri.parse(extensionUrl),
      );

      vscode.window.showInformationMessage(`${callbackUri.toString(true)}`);

      const creds = await vscode.commands.executeCommand("pearai.getPearAuth");
      console.log("auth:", creds);
    },
    "pearai.getPearAuth": async () => {
      // TODO: This may need some work, for now we dont have vscode ExtensionContext access in the ideProtocol.ts so this will do
      const accessToken = await extensionContext.secrets.get("pearai-token");
      const refreshToken = await extensionContext.secrets.get("pearai-refresh");

      const creds = {
        accessToken: accessToken ? accessToken.toString() : null,
        refreshToken: refreshToken ? refreshToken.toString() : null,
      };

      return creds;
    },
    "pearai.login": async () => {
      const extensionUrl = `${vscode.env.uriScheme}://pearai.pearai/auth`;
      const callbackUri = await vscode.env.asExternalUri(
        vscode.Uri.parse(extensionUrl),
      );

      // TODO: Open the proxy location with vscode redirect
      await vscode.env.openExternal(
        await vscode.env.asExternalUri(
          vscode.Uri.parse(
            `https://trypear.ai/signin?callback=${callbackUri.toString()}`, // Change to localhost if running locally
          ),
        ),
      );
    },
    "pearai.logout": async () => {
      await extensionContext.secrets.delete("pearai-token");
      await extensionContext.secrets.delete("pearai-refresh");
      core.invoke("llm/setPearAICredentials", { accessToken: undefined, refreshToken: undefined });
      vscode.commands.executeCommand("pearai-roo-cline.pearaiLogout")
      vscode.window.showInformationMessage("PearAI: Successfully logged out!");
    },
    "pearai.updateUserAuth": async (data: {
      accessToken: string;
      refreshToken: string;
    }) => {
      // Ensure that refreshToken and accessToken are both present
      if (!data || !(data.refreshToken && data.accessToken)) {
        vscode.window.showWarningMessage(
          "PearAI: Failed to parse user auth request!",
        );
        return;
      }

      extensionContext.secrets.store("pearai-token", data.accessToken);
      extensionContext.secrets.store("pearai-refresh", data.refreshToken);
      core.invoke("llm/setPearAICredentials", { accessToken: data.accessToken, refreshToken: data.refreshToken });
      sidebar.webviewProtocol?.request("pearAISignedIn", undefined);
      vscode.commands.executeCommand("pearai-roo-cline.pearaiLogin", data)
      vscode.window.showInformationMessage("PearAI: Successfully logged in!");
    },
    "pearai.closeChat": () => {
      vscode.commands.executeCommand("workbench.action.toggleAuxiliaryBar");
    },
    "pearai.loadRecentChat": () => {
      sidebar.webviewProtocol?.request("loadMostRecentChat", undefined, ["pearai.chatView"]);
      sidebar.webviewProtocol?.request("focusContinueInput", undefined, ["pearai.chatView"]);
    },
    "pearai.resizeAuxiliaryBarWidth": () => {
      vscode.commands.executeCommand(
        "workbench.action.resizeAuxiliaryBarWidth",
      );
    },
    "pearai.winshortcutResizeAuxiliaryBarWidth": () => {
      vscode.commands.executeCommand("pearai.resizeAuxiliaryBarWidth");
    },
    "pearai.macResizeAuxiliaryBarWidth": () => {
      vscode.commands.executeCommand("pearai.resizeAuxiliaryBarWidth");
    },
    "pearai.freeModelSwitch": (msg) => {
      const warnMsg = msg.warningMsg;
      const flagSet = extensionContext.globalState.get("freeModelSwitched");
      if (!warnMsg && flagSet) {
        // credit restored
        vscode.window.showInformationMessage("Credit restored. Switched back to PearAI Pro model.");
        extensionContext.globalState.update("freeModelSwitched", false);
        return;
      }
      if (warnMsg && !flagSet) {
        // limit reached, switching to free model
        vscode.window.showInformationMessage(msg.warningMsg);
        extensionContext.globalState.update("freeModelSwitched", true);
        sidebar.webviewProtocol?.request("switchModel", "PearAI Model (Recommended)", ["pearai.chatView"]);
      }
    },
    "pearai.patchWSL": async () => {
      if (process.platform !== 'win32') {
        vscode.window.showWarningMessage("WSL is for Windows only.");
        return;
      }

      const wslExtension = vscode.extensions.getExtension('ms-vscode-remote.remote-wsl');

      if (!wslExtension) {
        vscode.window.showInformationMessage("Please install WSL extension first, then try again.");
        return;
      }

      const wslExtensionPath = wslExtension.extensionPath;
      const pearExtensionPath = extensionContext.extensionPath;
      const wslDownloadScript = path.join( wslExtensionPath, "scripts", "wslDownload.sh" );
      const patchScript = path.join(pearExtensionPath, "wsl-scripts/wslPatch.sh");

      if (!fs.existsSync(patchScript)) {
        vscode.window.showWarningMessage("Patch script not found.");
        return;
      }

      let PEAR_COMMIT_ID = "";
      let VSC_COMMIT_ID = "";
      const productJsonPath = path.join(vscode.env.appRoot, "product.json");
      try {
        const productJson = JSON.parse(
          fs.readFileSync(productJsonPath, "utf8"),
        );
        PEAR_COMMIT_ID = productJson.commit;
        VSC_COMMIT_ID = productJson.VSCodeCommit;
        // testing commit ids - its for VSC version 1.89 most probably.
        // VSC_COMMIT_ID = "4849ca9bdf9666755eb463db297b69e5385090e3";
        // PEAR_COMMIT_ID="58996b5e761a7fe74bdfb4ac468e4b91d4d27294";
        vscode.window.showInformationMessage(`VSC commit: ${VSC_COMMIT_ID}`);
      } catch (error) {
        vscode.window.showErrorMessage("Error reading product.json");
        console.error("Error reading product.json:", error);
      }

      if (!PEAR_COMMIT_ID) {
        vscode.window.showWarningMessage(
          "Unable to retrieve PEAR commit ID.",
        );
        return;
      }

      if (!VSC_COMMIT_ID) {
        vscode.window.showWarningMessage(
          "Unable to retrieve VSCODE commit ID.",
        );
        return;
      }

      vscode.window.showInformationMessage(`Downloading WSL`);

      let terminal: vscode.Terminal;

      try {
        terminal = vscode.window.createTerminal({
          name: "WSL Patch",
          shellPath: "wsl.exe"
        });
      } catch (error) {
        vscode.window.showErrorMessage("WSL is not installed. Please install WSL and try again.");
        return;
      }

      terminal.sendText(`$(wslpath '${patchScript}') $(wslpath '${wslDownloadScript}') '${PEAR_COMMIT_ID}' '${VSC_COMMIT_ID}'`);
      terminal.show();
=======
    "continue.openMorePage": () => {
      vscode.commands.executeCommand("continue.navigateTo", "/more", true);
    },
    "continue.navigateTo": (path: string, toggle: boolean) => {
      sidebar.webviewProtocol?.request("navigateTo", { path, toggle });
      focusGUI();
    },
    "continue.startLocalOllama": () => {
      startLocalOllama(ide);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    },
  };
};

const registerCopyBufferSpy = (
  context: vscode.ExtensionContext,
  core: Core,
) => {
  const typeDisposable = vscode.commands.registerCommand(
    "editor.action.clipboardCopyAction",
    async (arg) => doCopy(typeDisposable),
  );

  async function doCopy(typeDisposable: any) {
    typeDisposable.dispose(); // must dispose to avoid endless loops

    await vscode.commands.executeCommand("editor.action.clipboardCopyAction");

    const clipboardText = await vscode.env.clipboard.readText();

    if (clipboardText) {
      core.invoke("clipboardCache/add", {
        content: clipboardText,
      });
    }

    await context.workspaceState.update("continue.copyBuffer", {
      text: clipboardText,
      copiedAt: new Date().toISOString(),
    });

    // re-register to continue intercepting copy commands
    typeDisposable = vscode.commands.registerCommand(
      "editor.action.clipboardCopyAction",
      async () => doCopy(typeDisposable),
    );
    context.subscriptions.push(typeDisposable);
  }

  context.subscriptions.push(typeDisposable);
};

export function registerAllCommands(
  context: vscode.ExtensionContext,
  ide: VsCodeIde,
  extensionContext: vscode.ExtensionContext,
  sidebar: ContinueGUIWebviewViewProvider,
  configHandler: ConfigHandler,
  verticalDiffManager: VerticalDiffManager,
  continueServerClientPromise: Promise<ContinueServerClient>,
  battery: Battery,
  quickEdit: QuickEdit,
  core: Core,
  editDecorationManager: EditDecorationManager,
) {
  // registerCopyBufferSpy(context, core);

  for (const [command, callback] of Object.entries(
    getCommandsMap(
      ide,
      extensionContext,
      sidebar,
      configHandler,
      verticalDiffManager,
      continueServerClientPromise,
      battery,
      quickEdit,
      core,
      editDecorationManager,
    ),
  )) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, callback),
    );
  }
}

