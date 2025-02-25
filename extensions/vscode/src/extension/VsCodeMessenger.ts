// Note: This file has been modified significantly from its original contents. New commands have been added, and there has been renaming from Continue to PearAI. pearai-submodule is a fork of Continue (https://github.com/continuedev/continue).

import { ConfigHandler } from "core/config/ConfigHandler";
<<<<<<< HEAD
import PearAIServer from "core/llm/llms/PearAIServer";
=======
import { getModelByRole } from "core/config/util";
import { applyCodeBlock } from "core/edit/lazy/applyCodeBlock";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import {
  FromCoreProtocol,
  FromWebviewProtocol,
  ToCoreProtocol,
} from "core/protocol";
import { ToWebviewFromCoreProtocol } from "core/protocol/coreWebview";
import { ToIdeFromWebviewOrCoreProtocol } from "core/protocol/ide";
import { ToIdeFromCoreProtocol } from "core/protocol/ideCore";
import { InProcessMessenger, Message } from "core/protocol/messenger";
import {
  CORE_TO_WEBVIEW_PASS_THROUGH,
  WEBVIEW_TO_CORE_PASS_THROUGH,
} from "core/protocol/passThrough";
import { stripImages } from "core/util/messageContent";
import { getUriPathBasename } from "core/util/uri";
import * as vscode from "vscode";
<<<<<<< HEAD
import { attemptInstallExtension, attemptUninstallExtension, isVSCodeExtensionInstalled } from "../activation/activate";
import { VerticalPerLineDiffManager } from "../diff/verticalPerLine/manager";
import { VsCodeIde } from "../ideProtocol";
import { getMem0Memories, updateMem0Memories } from "../integrations/mem0/mem0Service";
import { getFastApplyChangesWithRelace } from "../integrations/relace/relace";
=======

import { VerticalDiffManager } from "../diff/vertical/manager";
import EditDecorationManager from "../quickEdit/EditDecorationManager";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import {
  getControlPlaneSessionInfo,
  WorkOsAuthProvider,
} from "../stubs/WorkOsAuthProvider";
<<<<<<< HEAD
import { extractCodeFromMarkdown, TOOL_COMMANDS, ToolType } from "../util/integrationUtils";
=======
import { showTutorial } from "../util/tutorial";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import { getExtensionUri } from "../util/vscode";
import { VsCodeIde } from "../VsCodeIde";
import { VsCodeWebviewProtocol } from "../webviewProtocol";

/**
 * A shared messenger class between Core and Webview
 * so we don't have to rewrite some of the handlers
 */
type TODO = any;
type ToIdeOrWebviewFromCoreProtocol = ToIdeFromCoreProtocol &
  ToWebviewFromCoreProtocol;

export class VsCodeMessenger {
  onWebview<T extends keyof FromWebviewProtocol>(
    messageType: T,
    handler: (
      message: Message<FromWebviewProtocol[T][0]>,
    ) => Promise<FromWebviewProtocol[T][1]> | FromWebviewProtocol[T][1],
  ): void {
    void this.webviewProtocol.on(messageType, handler);
  }

  onCore<T extends keyof ToIdeOrWebviewFromCoreProtocol>(
    messageType: T,
    handler: (
      message: Message<ToIdeOrWebviewFromCoreProtocol[T][0]>,
    ) =>
      | Promise<ToIdeOrWebviewFromCoreProtocol[T][1]>
      | ToIdeOrWebviewFromCoreProtocol[T][1],
  ): void {
    this.inProcessMessenger.externalOn(messageType, handler);
  }

  onWebviewOrCore<T extends keyof ToIdeFromWebviewOrCoreProtocol>(
    messageType: T,
    handler: (
      message: Message<ToIdeFromWebviewOrCoreProtocol[T][0]>,
    ) =>
      | Promise<ToIdeFromWebviewOrCoreProtocol[T][1]>
      | ToIdeFromWebviewOrCoreProtocol[T][1],
  ): void {
    this.onWebview(messageType, handler);
    this.onCore(messageType, handler);
  }

  constructor(
    private readonly inProcessMessenger: InProcessMessenger<
      ToCoreProtocol,
      FromCoreProtocol
    >,
    private readonly webviewProtocol: VsCodeWebviewProtocol,
    private readonly ide: VsCodeIde,
    private readonly verticalDiffManagerPromise: Promise<VerticalDiffManager>,
    private readonly configHandlerPromise: Promise<ConfigHandler>,
    private readonly workOsAuthProvider: WorkOsAuthProvider,
    private readonly editDecorationManager: EditDecorationManager,
  ) {
    /** WEBVIEW ONLY LISTENERS **/
    this.onWebview("invokeVSCodeCommandById", (msg) => {
      const commandId = msg.data.commandId;
      const args = msg.data.args ?? [];
      vscode.commands.executeCommand(commandId, ...args);
    });
    // welcome stuff
    this.onWebview("markNewOnboardingComplete", (msg) => {
      vscode.commands.executeCommand("pearai.welcome.markNewOnboardingComplete");
    });
    this.onWebview("closeOverlay", (msg) => {
      vscode.commands.executeCommand("pearai.hideOverlay");
      vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
    });
    this.onWebview("lockOverlay", (msg) => {
      vscode.commands.executeCommand("pearai.lockOverlay");
    });
    this.onWebview("unlockOverlay", (msg) => {
      vscode.commands.executeCommand("pearai.unlockOverlay");
    });
    this.onWebview("importUserSettingsFromVSCode", async (msg) => {
      try {
        return await vscode.commands.executeCommand(
          "pearai.welcome.importUserSettingsFromVSCode",
        );
      } catch (error) {
        console.log("importUserSettingsFromVSCode rejectionReason", error);
        return false;
      }
    });
    this.onWebview("installVscodeExtension", (msg) => {
      attemptInstallExtension(msg.data.extensionId);
    });
    this.onWebview("uninstallVscodeExtension", (msg) => {
      attemptUninstallExtension(msg.data.extensionId);
    });
    this.onWebview("mem0/getMemories", async (msg) => {

      const memories = await getMem0Memories(PearAIServer._getRepoId());
      return memories;
    });
    this.onWebview("mem0/updateMemories", async (msg) => {
      const response = await updateMem0Memories(PearAIServer._getRepoId(), msg.data.changes);
      return response;
    });
    this.onWebview("is_vscode_extension_installed", async (msg) => {
      const isInstalled = await isVSCodeExtensionInstalled(msg.data.extensionId);
      console.log("VSCode extension installation status:", isInstalled);
      return isInstalled;
    });
    this.onWebview("pearWelcomeOpenFolder", (msg) => {
      vscode.commands.executeCommand("workbench.action.files.openFolder");
    });
    this.onWebview("pearInstallCommandLine", (msg) => {
      vscode.commands.executeCommand("workbench.action.installCommandLine");
    });
    // END welcome stuff
    this.onWebview("showFile", (msg) => {
      this.ide.openFile(msg.data.filepath);
    });

    this.onWebview("vscode/openMoveRightMarkdown", (msg) => {
      vscode.commands.executeCommand(
        "markdown.showPreview",
        vscode.Uri.joinPath(
          getExtensionUri(),
          "media",
          "move-chat-panel-right.md",
        ),
      );
    });
<<<<<<< HEAD
    this.onWebview("getNumberOfChanges", (msg) => {
      const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
      const repository = gitExtension?.getAPI(1).repositories[0];

      if (repository) {
          const unstagedChanges = repository.state.workingTreeChanges;
          return unstagedChanges.length;
      }
      return 0;
    });
    this.onWebview("openInventoryHome", (msg) => {
      vscode.commands.executeCommand("pearai.toggleInventoryHome");
    });
    this.onWebview("openInventorySettings", (msg) => {
      vscode.commands.executeCommand("pearai.toggleInventorySettings");
    });
    this.onWebview("pearAIinstallation", (msg) => {
      const { tools } = msg.data;
      if (tools) {
        tools.forEach((tool: ToolType) => {
          const toolCommand = TOOL_COMMANDS[tool];
          if (toolCommand) {
            if (toolCommand.args) {
              vscode.commands.executeCommand(toolCommand.command, toolCommand.args);
            } else {
              vscode.commands.executeCommand(toolCommand.command);
            }
          } else {
            console.warn(`Unknown tool: ${tool}`);
          }
        });
      }
    });
    this.onWebview("closePearAIOverlay", (msg) => {
      vscode.commands.executeCommand("pearai.unlockOverlay");
      vscode.commands.executeCommand("pearai.hideOverlay");
    });
    this.onWebview("highlightElement", (msg) => {
      vscode.commands.executeCommand("pearai.highlightElement", msg);
    });
    this.onWebview("unhighlightElement", (msg) => {
      vscode.commands.executeCommand("pearai.unhighlightElement", msg);
    });
    this.onWebview("getUrlTitle", async (msg) => {
      const url = msg.data;
      const res = await fetch(url);
      const text = await res.text();
      const match = text.match(/<title[^>]*>([^<]+)<\/title>/);
      return match ? match[1] : new URL(url).hostname;
    });
    this.onWebview("perplexityMode", (msg) => {
      vscode.commands.executeCommand("pearai.perplexityMode");
    });
    this.onWebview("addPerplexityContext", (msg) => {
      vscode.commands.executeCommand("pearai.addPerplexityContext", msg);
      vscode.commands.executeCommand("pearai.hideOverlay");
    });
    this.onWebview("toggleDevTools", (msg) => {
      vscode.commands.executeCommand("workbench.action.toggleDevTools");
      vscode.commands.executeCommand("pearai.viewLogs");
=======

    this.onWebview("toggleDevTools", (msg) => {
      vscode.commands.executeCommand("continue.viewLogs");
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    });
    this.onWebview("reloadWindow", (msg) => {
      vscode.commands.executeCommand("workbench.action.reloadWindow");
    });
    this.onWebview("focusEditor", (msg) => {
      vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
    });
    this.onWebview("toggleFullScreen", (msg) => {
      vscode.commands.executeCommand("pearai.toggleFullScreen");
    });
    this.onWebview("bigChat", (msg) => {
      vscode.commands.executeCommand("pearai.resizeAuxiliaryBarWidth");
    });
    this.onWebview("pearaiLogin", (msg) => {
      vscode.commands.executeCommand("pearai.login");
    });
    this.onWebview("lastChat", (msg) => {
      vscode.commands.executeCommand("pearai.loadRecentChat");
    });
    this.onWebview("closeChat", (msg) => {
      vscode.commands.executeCommand("pearai.closeChat");
    });
    this.onWebview("openHistory", (msg) => {
      vscode.commands.executeCommand("pearai.viewHistory");
    });
    this.onWebview("appendSelected", (msg) => {
      vscode.commands.executeCommand("pearai.focusContinueInputWithoutClear");
    });
<<<<<<< HEAD
    // History
    this.onWebview("saveFile", async (msg) => {
      return await ide.saveFile(msg.data.filepath);
    });
    this.onWebview("readFile", async (msg) => {
      return await ide.readFile(msg.data.filepath);
    });
    this.onWebview("createFile", async (msg) => {
      const workspaceDirs = await ide.getWorkspaceDirs();
      if (workspaceDirs.length === 0) {
        throw new Error(
          "No workspace directories found. Make sure you've opened a folder in your IDE.",
        );
      }
      const filePath = path.join(
        workspaceDirs[0],
        msg.data.path.replace(/^\//, ""),
      );

      if (!fs.existsSync(filePath)) {
        await ide.writeFile(filePath, "");
      }

      return ide.openFile(filePath);
    });
    this.onWebview("showDiff", async (msg) => {
      return await ide.showDiff(
        msg.data.filepath,
        msg.data.newContents,
        msg.data.stepIndex,
=======

    this.onWebview("acceptDiff", async ({ data: { filepath, streamId } }) => {
      await vscode.commands.executeCommand(
        "continue.acceptDiff",
        filepath,
        streamId,
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      );
    });

    this.onWebview("rejectDiff", async ({ data: { filepath, streamId } }) => {
      await vscode.commands.executeCommand(
        "continue.rejectDiff",
        filepath,
        streamId,
      );
    });

    this.onWebview("applyToFile", async ({ data }) => {
      webviewProtocol.request("updateApplyState", {
        streamId: data.streamId,
        status: "streaming",
        fileContent: data.text,
      });

      if (data.filepath) {
        const fileExists = await this.ide.fileExists(data.filepath);
        if (!fileExists) {
          await this.ide.writeFile(data.filepath, "");
          await this.ide.openFile(data.filepath);
        }

        await this.ide.openFile(data.filepath);
      }

      // Get active text editor
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage(
          "No active editor to apply edits to. Please open a file you'd like to apply the edits to first.",
        );
        return;
      }

      // If document is empty, insert at 0,0 and finish
      if (!editor.document.getText().trim()) {
        editor.edit((builder) =>
          builder.insert(new vscode.Position(0, 0), data.text),
        );

        void webviewProtocol.request("updateApplyState", {
          streamId: data.streamId,
          status: "closed",
          numDiffs: 0,
          fileContent: data.text,
        });

        return;
      }

      // Get LLM from config
      const configHandler = await configHandlerPromise;
      const { config } = await configHandler.loadConfig();

      if (!config) {
        vscode.window.showErrorMessage("Config not loaded");
        return;
      }

      let llm = getModelByRole(config, "applyCodeBlock");

      if (!llm) {
        llm = config.models.find(
          (model) => model.title === data.curSelectedModelTitle,
        );

        if (!llm) {
          vscode.window.showErrorMessage(
            `Model ${data.curSelectedModelTitle} not found in config.`,
          );
          return;
        }
      }

      const fastLlm = getModelByRole(config, "repoMapFileSelection") ?? llm;

      // Generate the diff and pass through diff manager
      const [instant, diffLines] = await applyCodeBlock(
        editor.document.getText(),
        data.text,
        getUriPathBasename(editor.document.uri.toString()),
        llm,
        fastLlm,
      );

      const verticalDiffManager = await this.verticalDiffManagerPromise;

      if (instant) {
        await verticalDiffManager.streamDiffLines(
          diffLines,
          instant,
          data.streamId,
        );
      } else {
        const prompt = `The following code was suggested as an edit:\n\`\`\`\n${data.text}\n\`\`\`\nPlease apply it to the previous code.`;
        const fullEditorRange = new vscode.Range(
          0,
          0,
          editor.document.lineCount - 1,
          editor.document.lineAt(editor.document.lineCount - 1).text.length,
        );
        const rangeToApplyTo = editor.selection.isEmpty
          ? fullEditorRange
          : editor.selection;

        await verticalDiffManager.streamEdit(
          prompt,
          llm.title,
          data.streamId,
          undefined,
          undefined,
          rangeToApplyTo,
          data.text,
        );
      }
    });

    // Fast Apply with Relace Horizontal 🚀
    this.onWebview("applyWithRelaceHorizontal", async (msg) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage(
          "No active editor to apply edits to. Please open a file you'd like to apply the edits to first.",
        );
        this.webviewProtocol.request("setRelaceDiffState", {diffVisible: false});
        return;
      }

      try {
        const originalContent = editor.document.getText();
        const changesToApply = msg.data.contentToApply;

        if (originalContent?.trim() === '') {
          await ide.writeFile(editor.document.uri.fsPath, changesToApply);
          this.webviewProtocol.request("setRelaceDiffState", {diffVisible: false});
          return;
        }

        let modifiedContent = await getFastApplyChangesWithRelace(
          originalContent,
          changesToApply,
        );

        modifiedContent = extractCodeFromMarkdown(modifiedContent);

        if (modifiedContent.length === 0) {
          vscode.window.showInformationMessage("Received empty response from Relace");
          this.webviewProtocol.request("setRelaceDiffState", {diffVisible: false});
          return;
        }

        if (modifiedContent === originalContent) {
          vscode.window.showInformationMessage("No changes to apply");
          this.webviewProtocol.request("setRelaceDiffState", {diffVisible: false});
          return;
        }

        this.webviewProtocol.request("setRelaceDiffState", {diffVisible: true});
        // Show inline diff using the original apply method
        const stepIndex = Date.now(); // Unique identifier for this diff
        await ide.showDiff(editor.document.uri.fsPath, modifiedContent, stepIndex);

      } catch (error) {
        vscode.window.showErrorMessage(`Fast Apply Inline failed: ${error}`);
        this.webviewProtocol.request("setRelaceDiffState", {diffVisible: false});
      }
    });

    // Accept the changes ✅
    this.onWebview("acceptRelaceDiff", async (msg) => {
      try {
        vscode.commands.executeCommand("pearai.acceptDiff");
        this.webviewProtocol.request("setRelaceDiffState", {diffVisible: false});
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to apply changes: ${error}`);
      }
    });

    // Reject the changes ❌
    this.onWebview("rejectRelaceDiff", async (msg) => {
      try {
        vscode.commands.executeCommand("pearai.rejectDiff");
        this.webviewProtocol.request("setRelaceDiffState", {diffVisible: false});
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to reject changes: ${error}`);
      }
    });

    this.onWebview("showTutorial", async (msg) => {
<<<<<<< HEAD
      const tutorialPath = path.join(
        getExtensionUri().fsPath,
        "pearai_tutorial.py",
      );
      // Ensure keyboard shortcuts match OS
      if (process.platform !== "darwin") {
        let tutorialContent = fs.readFileSync(tutorialPath, "utf8");
        tutorialContent = tutorialContent
          .replace("⌘", "^")
          .replace("Cmd", "Ctrl");
        fs.writeFileSync(tutorialPath, tutorialContent);
      }

      const doc = await vscode.workspace.openTextDocument(
        vscode.Uri.file(tutorialPath),
      );
      await vscode.window.showTextDocument(doc);
=======
      await showTutorial(this.ide);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    });

    this.onWebview(
      "overwriteFile",
      async ({ data: { prevFileContent, filepath } }) => {
        if (prevFileContent === null) {
          // TODO: Delete the file
          return;
        }

        await this.ide.openFile(filepath);

        // Get active text editor
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
          vscode.window.showErrorMessage("No active editor to apply edits to");
          return;
        }

        editor.edit((builder) =>
          builder.replace(
            new vscode.Range(
              editor.document.positionAt(0),
              editor.document.positionAt(editor.document.getText().length),
            ),
            prevFileContent,
          ),
        );
      },
    );

    this.onWebview("insertAtCursor", async (msg) => {
      const editor = vscode.window.activeTextEditor;
      if (editor === undefined || !editor.selection) {
        return;
      }

      editor.edit((editBuilder) => {
        editBuilder.replace(
          new vscode.Range(editor.selection.start, editor.selection.end),
          msg.data.text,
        );
      });
    });
    this.onWebview("edit/sendPrompt", async (msg) => {
      const prompt = msg.data.prompt;
      const { start, end } = msg.data.range.range;
      const verticalDiffManager = await verticalDiffManagerPromise;
      const modelTitle = await this.webviewProtocol.request(
        "getDefaultModelTitle",
        undefined,
      );
      const fileAfterEdit = await verticalDiffManager.streamEdit(
        stripImages(prompt),
        modelTitle,
        "edit",
        undefined,
        undefined,
        new vscode.Range(
          new vscode.Position(start.line, start.character),
          new vscode.Position(end.line, end.character),
        ),
      );

      void this.webviewProtocol.request("setEditStatus", {
        status: "accepting",
        fileAfterEdit,
      });
    });
    this.onWebview("edit/acceptReject", async (msg) => {
      const { onlyFirst, accept, filepath } = msg.data;
      if (accept && onlyFirst) {
        // Accept first
        vscode.commands.executeCommand(
          "continue.acceptVerticalDiffBlock",
          filepath,
          0,
        );
      } else if (accept) {
        vscode.commands.executeCommand("continue.acceptDiff", filepath);
        // Accept all
      } else if (onlyFirst) {
        // Reject first
        vscode.commands.executeCommand(
          "continue.rejectVerticalDiffBlock",
          filepath,
          0,
        );
      } else {
        // Reject all
        vscode.commands.executeCommand("continue.rejectDiff", filepath);
      }
    });
    this.onWebview("edit/exit", async (msg) => {
      if (msg.data.shouldFocusEditor) {
        const activeEditor = vscode.window.activeTextEditor;

        if (activeEditor) {
          vscode.window.showTextDocument(activeEditor.document);
        }
      }

      editDecorationManager.clear();
    });

    /** PASS THROUGH FROM WEBVIEW TO CORE AND BACK **/
    WEBVIEW_TO_CORE_PASS_THROUGH.forEach((messageType) => {
      this.onWebview(messageType, async (msg) => {
        return await this.inProcessMessenger.externalRequest(
          messageType,
          msg.data,
          msg.messageId,
        );
      });
    });

    /** PASS THROUGH FROM CORE TO WEBVIEW AND BACK **/
    CORE_TO_WEBVIEW_PASS_THROUGH.forEach((messageType) => {
      this.onCore(messageType, async (msg) => {
        return this.webviewProtocol.request(messageType, msg.data);
      });
    });

    /** CORE ONLY LISTENERS **/
    // None right now

    /** BOTH CORE AND WEBVIEW **/
    this.onWebviewOrCore("readRangeInFile", async (msg) => {
      return await vscode.workspace
        .openTextDocument(msg.data.filepath)
        .then((document) => {
          const start = new vscode.Position(0, 0);
          const end = new vscode.Position(5, 0);
          const range = new vscode.Range(start, end);

          const contents = document.getText(range);
          return contents;
        });
    });

    this.onWebviewOrCore("getIdeSettings", async (msg) => {
      return ide.getIdeSettings();
    });
    this.onWebviewOrCore("getDiff", async (msg) => {
      return ide.getDiff(msg.data.includeUnstaged);
    });
    this.onWebviewOrCore("getTerminalContents", async (msg) => {
      return ide.getTerminalContents();
    });
    this.onWebviewOrCore("getDebugLocals", async (msg) => {
      return ide.getDebugLocals(Number(msg.data.threadIndex));
    });
    this.onWebviewOrCore("getAvailableThreads", async (msg) => {
      return ide.getAvailableThreads();
    });
    this.onWebviewOrCore("getTopLevelCallStackSources", async (msg) => {
      return ide.getTopLevelCallStackSources(
        msg.data.threadIndex,
        msg.data.stackDepth,
      );
    });
    this.onWebviewOrCore("getWorkspaceDirs", async (msg) => {
      return ide.getWorkspaceDirs();
    });
    this.onWebviewOrCore("writeFile", async (msg) => {
      return ide.writeFile(msg.data.path, msg.data.contents);
    });
    this.onWebviewOrCore("showVirtualFile", async (msg) => {
      return ide.showVirtualFile(msg.data.name, msg.data.content);
    });
    this.onWebviewOrCore("openFile", async (msg) => {
      return ide.openFile(msg.data.path);
    });
    this.onWebviewOrCore("runCommand", async (msg) => {
      await ide.runCommand(msg.data.command);
    });
    this.onWebviewOrCore("getSearchResults", async (msg) => {
      return ide.getSearchResults(msg.data.query);
    });
    this.onWebviewOrCore("subprocess", async (msg) => {
      return ide.subprocess(msg.data.command, msg.data.cwd);
    });
    this.onWebviewOrCore("getProblems", async (msg) => {
      return ide.getProblems(msg.data.filepath);
    });
    this.onWebviewOrCore("getBranch", async (msg) => {
      const { dir } = msg.data;
      return ide.getBranch(dir);
    });
    this.onWebviewOrCore("getOpenFiles", async (msg) => {
      return ide.getOpenFiles();
    });
    this.onWebviewOrCore("getCurrentFile", async () => {
      return ide.getCurrentFile();
    });
    this.onWebviewOrCore("getPinnedFiles", async (msg) => {
      return ide.getPinnedFiles();
    });
    this.onWebviewOrCore("showLines", async (msg) => {
      const { filepath, startLine, endLine } = msg.data;
      return ide.showLines(filepath, startLine, endLine);
    });
    this.onWebviewOrCore("showToast", (msg) => {
      this.ide.showToast(...msg.data);
    });
    this.onWebviewOrCore("getGitHubAuthToken", (msg) =>
      ide.getGitHubAuthToken(msg.data),
    );

    this.onWebviewOrCore("getPearAuth", (msg) => ide.getPearAuth());

    this.onWebviewOrCore("getControlPlaneSessionInfo", async (msg) => {
      return getControlPlaneSessionInfo(
        msg.data.silent,
        msg.data.useOnboarding,
      );
    });
    this.onWebviewOrCore("logoutOfControlPlane", async (msg) => {
      const sessions = await this.workOsAuthProvider.getSessions();
      await Promise.all(
        sessions.map((session) => workOsAuthProvider.removeSession(session.id)),
      );
      vscode.commands.executeCommand(
        "setContext",
        "continue.isSignedInToControlPlane",
        false,
      );
    });
    this.onWebviewOrCore("saveFile", async (msg) => {
      return await ide.saveFile(msg.data.filepath);
    });
    this.onWebviewOrCore("readFile", async (msg) => {
      return await ide.readFile(msg.data.filepath);
    });
    this.onWebviewOrCore("openUrl", (msg) => {
      vscode.env.openExternal(vscode.Uri.parse(msg.data));
    });

    this.onWebviewOrCore("fileExists", async (msg) => {
      return await ide.fileExists(msg.data.filepath);
    });

    this.onWebviewOrCore("gotoDefinition", async (msg) => {
      return await ide.gotoDefinition(msg.data.location);
    });

    this.onWebviewOrCore("getFileStats", async (msg) => {
      return await ide.getFileStats(msg.data.files);
    });

    this.onWebviewOrCore("getGitRootPath", async (msg) => {
      return await ide.getGitRootPath(msg.data.dir);
    });

    this.onWebviewOrCore("listDir", async (msg) => {
      return await ide.listDir(msg.data.dir);
    });

    this.onWebviewOrCore("getRepoName", async (msg) => {
      return await ide.getRepoName(msg.data.dir);
    });

    this.onWebviewOrCore("getTags", async (msg) => {
      return await ide.getTags(msg.data);
    });

    this.onWebviewOrCore("getIdeInfo", async (msg) => {
      return await ide.getIdeInfo();
    });

    this.onWebviewOrCore("isTelemetryEnabled", async (msg) => {
      return await ide.isTelemetryEnabled();
    });

    this.onWebviewOrCore("getWorkspaceConfigs", async (msg) => {
      return await ide.getWorkspaceConfigs();
    });

    this.onWebviewOrCore("getUniqueId", async (msg) => {
      return await ide.getUniqueId();
    });
  }
}
