import { ConfigHandler } from "core/config/ConfigHandler";
import { getTheme, getThemeType } from "./util/getTheme";
import * as vscode from "vscode";
<<<<<<< HEAD
=======

import { getTheme } from "./util/getTheme";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import { getExtensionVersion } from "./util/util";
import { getExtensionUri, getNonce, getUniqueId } from "./util/vscode";
import { VsCodeWebviewProtocol } from "./webviewProtocol";
import { isFirstLaunch } from "./copySettings";
import { PEARAI_CHAT_VIEW_ID, PEARAI_OVERLAY_VIEW_ID } from "./util/pearai/pearaiViewTypes";

// The overlay's webview title/id is defined in pearai-app's PearOverlayParts.ts
// A unique identifier is needed for the messaging protocol to distinguish the webviews.

import type { FileEdit } from "core";

export class ContinueGUIWebviewViewProvider
  implements vscode.WebviewViewProvider
{
  public static readonly viewType = PEARAI_CHAT_VIEW_ID;
  public webviewProtocol: VsCodeWebviewProtocol;
  private _webview?: vscode.Webview;
  private _webviewView?: vscode.WebviewView;
  private outputChannel: vscode.OutputChannel;
  private enableDebugLogs: boolean;

<<<<<<< HEAD
  private updateDebugLogsStatus() {
    const settings = vscode.workspace.getConfiguration("pearai");
    this.enableDebugLogs = settings.get<boolean>("enableDebugLogs", false);
    if (this.enableDebugLogs) {
      this.outputChannel.show(true);
    } else {
      this.outputChannel.hide();
    }
  }

  // Show or hide the output channel on enableDebugLogs
  private setupDebugLogsListener() {
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("pearai.enableDebugLogs")) {
        const settings = vscode.workspace.getConfiguration("pearai");
        const enableDebugLogs = settings.get<boolean>("enableDebugLogs", false);
        if (enableDebugLogs) {
          this.outputChannel.show(true);
        } else {
          this.outputChannel.hide();
        }
      }
    });
  }

  private async handleWebviewMessage(message: any) {
    if (message.messageType === "log") {
      const settings = vscode.workspace.getConfiguration("pearai");
      const enableDebugLogs = settings.get<boolean>("enableDebugLogs", false);

      if (message.level === "debug" && !enableDebugLogs) {
        return; // Skip debug logs if enableDebugLogs is false
      }

      const timestamp = new Date().toISOString().split(".")[0];
      const logMessage = `[${timestamp}] [${message.level.toUpperCase()}] ${message.text}`;
      this.outputChannel.appendLine(logMessage);
    }
  }

=======
  public get isReady(): boolean {
    return !!this.webview;
  }

>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): void | Thenable<void> {
    this._webviewView = webviewView;
    this._webview = webviewView.webview;
<<<<<<< HEAD

    this._webview.onDidReceiveMessage((message) => {
      return this.handleWebviewMessage(message);
    });
=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    webviewView.webview.html = this.getSidebarContent(
      this.extensionContext,
      webviewView,
    );
  }

<<<<<<< HEAD
=======
  private _webview?: vscode.Webview;
  private _webviewView?: vscode.WebviewView;

>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  get isVisible() {
    return this._webviewView?.visible;
  }

  get webview() {
    return this._webview;
  }

  public resetWebviewProtocolWebview(): void {
    if (this._webview) {
      this.webviewProtocol.resetWebviewToDefault()
    } else {
      console.warn("no webview found during reset");
    }
  }

  sendMainUserInput(input: string) {
    this.webview?.postMessage({
      type: "userInput",
      input,
    });
  }

  constructor(
    private readonly configHandlerPromise: Promise<ConfigHandler>,
    private readonly windowId: string,
    private readonly extensionContext: vscode.ExtensionContext,
  ) {
<<<<<<< HEAD
    this.outputChannel = vscode.window.createOutputChannel("PearAI");
    this.enableDebugLogs = false;
    this.updateDebugLogsStatus();
    this.setupDebugLogsListener();

=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    this.webviewProtocol = new VsCodeWebviewProtocol(
      (async () => {
        const configHandler = await this.configHandlerPromise;
        return configHandler.reloadConfig();
      }).bind(this),
    );
  }

  getSidebarContent(
    context: vscode.ExtensionContext | undefined,
    panel: vscode.WebviewPanel | vscode.WebviewView,
    page: string | undefined = undefined,
    edits: FileEdit[] | undefined = undefined,
    isFullScreen = false,
    initialRoute: string = "/"
  ): string {
    const panelViewType = panel?.viewType; // eg. pearai.chatView
    const isOverlay = panel?.title === PEARAI_OVERLAY_VIEW_ID; // defined in pearai-app PearOverlayPart.ts
    const extensionUri = getExtensionUri();
    let scriptUri: string;
    let styleMainUri: string;
    const vscMediaUrl: string = panel.webview
      .asWebviewUri(vscode.Uri.joinPath(extensionUri, "gui"))
      .toString();

    const inDevelopmentMode =
      context?.extensionMode === vscode.ExtensionMode.Development;
    if (!inDevelopmentMode) {
      scriptUri = panel.webview
        .asWebviewUri(vscode.Uri.joinPath(extensionUri, "gui/assets/index.js"))
        .toString();
      styleMainUri = panel.webview
        .asWebviewUri(vscode.Uri.joinPath(extensionUri, "gui/assets/index.css"))
        .toString();
    } else {
      scriptUri = "http://localhost:5173/src/main.tsx";
      styleMainUri = "http://localhost:5173/src/index.css";
    }

    panel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(extensionUri, "gui"),
        vscode.Uri.joinPath(extensionUri, "assets"),
      ],
      enableCommandUris: true,
      portMapping: [
        {
          webviewPort: 65433,
          extensionHostPort: 65433,
        },
      ],
    };

    const nonce = getNonce();

    const currentTheme = getTheme();
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration("workbench.colorTheme") ||
        e.affectsConfiguration("window.autoDetectColorScheme") ||
        e.affectsConfiguration("window.autoDetectHighContrast") ||
        e.affectsConfiguration("workbench.preferredDarkColorTheme") ||
        e.affectsConfiguration("workbench.preferredLightColorTheme") ||
        e.affectsConfiguration("workbench.preferredHighContrastColorTheme") ||
        e.affectsConfiguration("workbench.preferredHighContrastLightColorTheme")
      ) {
        // Send new theme to GUI to update embedded Monaco themes
        this.webviewProtocol?.request("setTheme", { theme: getTheme() });
        this.webviewProtocol?.request("setThemeType", {
          themeType: getThemeType(),
        });
      }
    });
    
    this.webviewProtocol.addWebview(panel?.title === PEARAI_OVERLAY_VIEW_ID? panel.title : panel.viewType, panel.webview);

    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script>
          const vscode = acquireVsCodeApi();
        </script>
        <link href="${styleMainUri}" rel="stylesheet">

        <title>PearAI</title>
      </head>
      <body>
        <div id="root"></div>

        ${
          inDevelopmentMode
            ? `<script type="module">
          import RefreshRuntime from "http://localhost:5173/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
          </script>`
            : ""
        }

        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>

        <script>localStorage.setItem("ide", '"vscode"')</script>
        <script>localStorage.setItem("extensionVersion", '"${getExtensionVersion()}"')</script>
        <script>window.windowId = "${this.windowId}"</script>
        <script>window.vscMachineId = "${getUniqueId()}"</script>
        <script>window.vscMediaUrl = "${vscMediaUrl}"</script>
        <script>window.ide = "vscode"</script>
        <script>window.fullColorTheme = ${JSON.stringify(currentTheme)}</script>
        <script>window.colorThemeName = "dark-plus"</script>
        <script>window.workspacePaths = ${JSON.stringify(
          vscode.workspace.workspaceFolders?.map((folder) =>
            folder.uri.toString(),
          ) || [],
        )}</script>
        <script>window.isFirstLaunch = ${isFirstLaunch(this.extensionContext)}</script>
        <script>window.isFullScreen = ${isFullScreen}</script>
        <script>window.viewType = "${panelViewType}"</script>
        <script>window.isPearOverlay = ${isOverlay}</script>
        <script>window.initialRoute = "${initialRoute}"</script>

        ${
          edits
            ? `<script>window.edits = ${JSON.stringify(edits)}</script>`
            : ""
        }
        ${page ? `<script>window.location.pathname = "${page}"</script>` : ""}
      </body>
      ${isOverlay ? `
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: transparent;
              width: 100vw;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              position: fixed;
              top: 0;
              left: 0;
            }
            
            #root {
              width: 80%;
              height: 80%;
            }
          </style>
          <script>
            document.body.addEventListener('click', function(e) {
                if (e.target === document.body) {
                    vscode.postMessage({ messageType: 'closeOverlay', messageId: "closeOverlay" });
                    vscode.commands.executeCommand("workbench.action.focusActiveEditorGroup");
                }
            });
          </script>
      `: ""}
    </html>`;
  }
}
