<<<<<<< HEAD
import {
  Memory,
  MemoryChange,
  ToolType,
} from "../../extensions/vscode/src/util/integrationUtils.js";
import type { RangeInFileWithContents } from "../commands/util.js";
import type { ContextSubmenuItem } from "../index.js";
import { ToIdeFromWebviewOrCoreProtocol } from "./ide.js";
import { ToWebviewFromIdeOrCoreProtocol } from "./webview.js";
=======
import { ToIdeFromWebviewOrCoreProtocol } from "./ide";
import { ToWebviewFromIdeOrCoreProtocol } from "./webview";

import type {
  ApplyState,
  CodeToEdit,
  ContextSubmenuItem,
  EditStatus,
  MessageContent,
  RangeInFileWithContents,
} from "../";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

export type ToIdeFromWebviewProtocol = ToIdeFromWebviewOrCoreProtocol & {
  openUrl: [string, void];
  // We pass the `curSelectedModel` because we currently cannot access the
  // default model title in the GUI from JB
  applyToFile: [
    {
      text: string;
      streamId: string;
      curSelectedModelTitle: string;
      filepath?: string;
    },
    void,
  ];
  overwriteFile: [{ filepath: string; prevFileContent: string | null }, void];
  showTutorial: [undefined, void];
  showFile: [{ filepath: string }, void];
  toggleDevTools: [undefined, void];
  reloadWindow: [undefined, void];
  focusEditor: [undefined, void];
  toggleFullScreen: [{ newWindow?: boolean } | undefined, void];
  insertAtCursor: [{ text: string }, void];
  copyText: [{ text: string }, void];
  "jetbrains/isOSREnabled": [undefined, boolean];
  "jetbrains/onLoad": [
    undefined,
    {
      windowId: string;
      serverUrl: string;
      workspacePaths: string[];
      vscMachineId: string;
      vscMediaUrl: string;
    },
  ];
<<<<<<< HEAD
  openUrl: [string, void];
  applyToCurrentFile: [{ text: string }, void];
  applyWithRelaceHorizontal: [{ contentToApply: string }, void];
  acceptRelaceDiff: [{ originalFileUri: string; diffFileUri: string }, void];
  rejectRelaceDiff: [{ originalFileUri: string; diffFileUri: string }, void];
  createFile: [{ path: string }, void];
  showTutorial: [undefined, void];
  showFile: [{ filepath: string }, void];
  openConfigJson: [undefined, void];
  highlightElement: [{ elementSelectors: string[] }, void];
  unhighlightElement: [{ elementSelectors: string[] }, void];
  perplexityMode: [undefined, void];
  addPerplexityContext: [{ text: string; language: string }, void];
  addPerplexityContextinChat: [{ text: string; language: string }, void];
  toggleDevTools: [undefined, void];
  reloadWindow: [undefined, void];
  focusEditor: [undefined, void];
  toggleFullScreen: [undefined, void];
  insertAtCursor: [{ text: string }, void];
  copyText: [{ text: string }, void];
  "jetbrains/editorInsetHeight": [{ height: number }, void];
  setGitHubAuthToken: [{ token: string }, void];
  // for shortcuts bar
  bigChat: [undefined, void];
  lastChat: [undefined, void];
  closeChat: [undefined, void];
  openHistory: [undefined, void];
  openHistorySearch: [undefined, void];
  appendSelected: [undefined, void];
  pearaiLogin: [undefined, void];
  closePearAIOverlay: [undefined, void];
  getNumberOfChanges: [undefined, number];
  isSupermavenInstalled: [undefined, boolean];
  uninstallVscodeExtension: [{ extensionId: string }, void];
  completeWelcome: [undefined, void];
  openInventoryHome: [undefined, void];
  openInventorySettings: [undefined, void];
  getUrlTitle: [string, string];
  pearAIinstallation: [{ tools: ToolType[] }, void];
  importUserSettingsFromVSCode: [undefined, boolean];
  "mem0/getMemories": [undefined, Memory[]];
  "mem0/updateMemories": [{ changes: MemoryChange[] }, boolean];
=======
  "jetbrains/getColors": [undefined, Record<string, string>];
  "vscode/openMoveRightMarkdown": [undefined, void];
  setGitHubAuthToken: [{ token: string }, void];
  acceptDiff: [{ filepath: string; streamId?: string }, void];
  rejectDiff: [{ filepath: string; streamId?: string }, void];
  "edit/sendPrompt": [
    { prompt: MessageContent; range: RangeInFileWithContents },
    void,
  ];
  "edit/acceptReject": [
    { accept: boolean; onlyFirst: boolean; filepath: string },
    void,
  ];
  "edit/exit": [{ shouldFocusEditor: boolean }, void];
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
};

export type ToWebviewFromIdeProtocol = ToWebviewFromIdeOrCoreProtocol & {
  setInactive: [undefined, void];
  setActiveFilePath: [string | undefined, void];
  restFirstLaunchInGUI: [undefined, void];
  showInteractiveContinueTutorial: [undefined, void];
  submitMessage: [{ message: any }, void]; // any -> JSONContent from TipTap
  newSessionWithPrompt: [{ prompt: string }, void];
  userInput: [{ input: string }, void];
  focusContinueInput: [undefined, void];
  focusContinueInputWithoutClear: [undefined, void];
  focusContinueInputWithNewSession: [undefined, void];
  highlightedCode: [
    {
      rangeInFileWithContents: RangeInFileWithContents;
      prompt?: string;
      shouldRun?: boolean;
    },
    void,
  ];
  addCodeToEdit: [CodeToEdit, void];
  navigateTo: [{ path: string; toggle?: boolean }, void];
  addModel: [undefined, void];

  focusContinueSessionId: [{ sessionId: string | undefined }, void];
  newSession: [undefined, void];
  newSessionSearch: [undefined, void];
  quickEdit: [undefined, void];
  acceptedOrRejectedDiff: [undefined, void];
  setTheme: [{ theme: any }, void];
  setThemeType: [{ themeType: string }, void];
  setColors: [{ [key: string]: string }, void];
  "jetbrains/editorInsetRefresh": [undefined, void];
  "jetbrains/isOSREnabled": [boolean, void];
  addApiKey: [undefined, void];
  setupLocalConfig: [undefined, void];
  incrementFtc: [undefined, void];
<<<<<<< HEAD
  openOnboarding: [undefined, void];
  addPerplexityContext: [{ text: string; language: string }, void];
  addPerplexityContextinChat: [{ text: string; language: string }, void];
  navigateToCreator: [undefined, void];
  navigateToSearch: [undefined, void];
  navigateToMem0: [undefined, void];
  navigateToWrapped: [undefined, void];
  toggleInventorySettings: [undefined, void];
  navigateToInventoryHome: [undefined, void];
  getCurrentTab: [undefined, string];
  setRelaceDiffState: [{ diffVisible: boolean }, void];
=======
  openOnboardingCard: [undefined, void];
  applyCodeFromChat: [undefined, void];
  updateApplyState: [ApplyState, void];
  setEditStatus: [{ status: EditStatus; fileAfterEdit?: string }, void];
  exitEditMode: [undefined, void];
  focusEdit: [undefined, void];
  focusEditWithoutClear: [undefined, void];
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
};
