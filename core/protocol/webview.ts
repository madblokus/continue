import { ConfigResult, ConfigValidationError } from "@continuedev/config-yaml";
import type {
  BrowserSerializedContinueConfig,
  ContextItemWithId,
  ContextProviderName,
  IndexingProgressUpdate,
  IndexingStatus,
  PackageDocsResult,
} from "../index.js";

export type ToWebviewFromIdeOrCoreProtocol = {
  configUpdate: [
    {
      result: ConfigResult<BrowserSerializedContinueConfig>;
      profileId: string | null;
    },
    void,
  ];
  configError: [ConfigValidationError[] | undefined, void];
  getDefaultModelTitle: [undefined, string];
<<<<<<< HEAD
  loadMostRecentChat: [undefined, void];
  indexProgress: [IndexingProgressUpdate, void];
  refreshSubmenuItems: [undefined, void];
=======
  indexProgress: [IndexingProgressUpdate, void]; // Codebase
  "indexing/statusUpdate": [IndexingStatus, void]; // Docs, etc.
  refreshSubmenuItems: [
    {
      providers: "all" | "dependsOnIndexing" | ContextProviderName[];
    },
    void,
  ];
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  isContinueInputFocused: [undefined, boolean];
  pearAISignedIn: [undefined, void];
  switchModel: [string, void];
  addContextItem: [
    {
      historyIndex: number;
      item: ContextItemWithId;
    },
    void,
  ];
  setTTSActive: [boolean, void];
  getWebviewHistoryLength: [undefined, number];
  getCurrentSessionId: [undefined, string];
  "docs/suggestions": [PackageDocsResult[], void];
  "jetbrains/setColors": [Record<string, string>, void];
};
