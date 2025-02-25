import { ControlPlaneSessionInfo } from "../control-plane/client";

import type {
  ContinueRcJson,
  DiffLine,
  FileStatsMap,
  FileType,
  IDE,
  IdeInfo,
  IdeSettings,
  IndexTag,
  Location,
  PearAuth,
  Problem,
  Range,
  RangeInFile,
  TerminalOptions,
  Thread,
} from "../";

export interface GetGhTokenArgs {
  force?: boolean;
}

export type ToIdeFromWebviewOrCoreProtocol = {
  // Methods from IDE type
  getIdeInfo: [undefined, IdeInfo];
  getWorkspaceDirs: [undefined, string[]];
  writeFile: [{ path: string; contents: string }, void];
  showVirtualFile: [{ name: string; content: string }, void];
  openFile: [{ path: string }, void];
  openUrl: [string, void];
  runCommand: [{ command: string; options?: TerminalOptions }, void];
  getSearchResults: [{ query: string }, string];
  subprocess: [{ command: string; cwd?: string }, [string, string]];
  saveFile: [{ filepath: string }, void];
  fileExists: [{ filepath: string }, boolean];
  readFile: [{ filepath: string }, string];
  diffLine: [
    {
      diffLine: DiffLine;
      filepath: string;
      startLine: number;
      endLine: number;
    },
    void,
  ];
  getProblems: [{ filepath: string }, Problem[]];
  getOpenFiles: [undefined, string[]];
  getCurrentFile: [
    undefined,
    (
      | undefined
      | {
          isUntitled: boolean;
          path: string;
          contents: string;
        }
    ),
  ];
  getPinnedFiles: [undefined, string[]];
  showLines: [{ filepath: string; startLine: number; endLine: number }, void];
  readRangeInFile: [{ filepath: string; range: Range }, string];
  getDiff: [{ includeUnstaged: boolean }, string[]];
  getWorkspaceConfigs: [undefined, ContinueRcJson[]];
  getTerminalContents: [undefined, string];
  getDebugLocals: [{ threadIndex: number }, string];
  getTopLevelCallStackSources: [
    { threadIndex: number; stackDepth: number },
    string[],
  ];
  getAvailableThreads: [undefined, Thread[]];
  isTelemetryEnabled: [undefined, boolean];
  getUniqueId: [undefined, string];
  getTags: [string, IndexTag[]];
  readSecrets: [{ keys: string[] }, Record<string, string>];
  writeSecrets: [{ secrets: Record<string, string> }, void];
  // end methods from IDE type

  getIdeSettings: [undefined, IdeSettings];

  // Git
  getBranch: [{ dir: string }, string];
  getRepoName: [{ dir: string }, string | undefined];

  showToast: [
    Parameters<IDE["showToast"]>,
    Awaited<ReturnType<IDE["showToast"]>>,
  ];
  getGitRootPath: [{ dir: string }, string | undefined];
  listDir: [{ dir: string }, [string, FileType][]];
  getFileStats: [{ files: string[] }, FileStatsMap];

  gotoDefinition: [{ location: Location }, RangeInFile[]];

  getGitHubAuthToken: [GetGhTokenArgs, string | undefined];
  getControlPlaneSessionInfo: [
    { silent: boolean; useOnboarding: boolean },
    ControlPlaneSessionInfo | undefined,
  ];
  logoutOfControlPlane: [undefined, void];
<<<<<<< HEAD
  pathSep: [undefined, string];
  getPearAuth: [undefined, PearAuth];
  updatePearCredentials: [PearAuth, void];

  authenticatePear: [undefined, void];
  getCurrentDirectory: [undefined, string];

  // new welcome page
  markNewOnboardingComplete: [undefined, void];
  importUserSettingsFromVSCode: [undefined, boolean];
  pearWelcomeOpenFolder: [undefined, void];
  pearInstallCommandLine: [undefined, void];
  installVscodeExtension: [{ extensionId: string }, void];
  is_vscode_extension_installed: [{ extensionId: string }, boolean];

  // overlay
  closeOverlay: [undefined, void];
  lockOverlay: [undefined, void];
  unlockOverlay: [undefined, void];

  /* dont overuse invokeVSCodeCommandById, use it only for devving,
  and if you find yourself writing redundant code just to invoke a
  command not related to pearai. (workbench, other extension)
  */
  invokeVSCodeCommandById: [
    { commandId: string; args?: any[] },
    any | undefined,
  ];
=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
};

export type ToWebviewOrCoreFromIdeProtocol = {
  didChangeActiveTextEditor: [{ filepath: string }, void];
  didChangeControlPlaneSessionInfo: [
    { sessionInfo: ControlPlaneSessionInfo | undefined },
    void,
  ];
  didChangeIdeSettings: [{ settings: IdeSettings }, void];
};
