<<<<<<< HEAD
import { ContextProviderName } from "../../index.js";
import { BaseContextProvider } from "../index.js";
import CodeContextProvider from "./CodeContextProvider.js";
import CodebaseContextProvider from "./CodebaseContextProvider.js";
import ContinueProxyContextProvider from "./ContinueProxyContextProvider.js";
import CurrentFileContextProvider from "./CurrentFileContextProvider.js";
import DatabaseContextProvider from "./DatabaseContextProvider.js";
import DiffContextProvider from "./DiffContextProvider.js";
import DocsContextProvider from "./DocsContextProvider.js";
import FileTreeContextProvider from "./FileTreeContextProvider.js";
import FolderContextProvider from "./FolderContextProvider.js";
import GitHubIssuesContextProvider from "./GitHubIssuesContextProvider.js";
import GitLabMergeRequestContextProvider from "./GitLabMergeRequestContextProvider.js";
import GoogleContextProvider from "./GoogleContextProvider.js";
import HttpContextProvider from "./HttpContextProvider.js";
import JiraIssuesContextProvider from "./JiraIssuesContextProvider/index.js";
import LocalsProvider from "./LocalsProvider.js";
import OSContextProvider from "./OSContextProvider.js";
import OpenFilesContextProvider from "./OpenFilesContextProvider.js";
import PostgresContextProvider from "./PostgresContextProvider.js";
import ProblemsContextProvider from "./ProblemsContextProvider.js";
import SearchContextProvider from "./SearchContextProvider.js";
import TerminalContextProvider from "./TerminalContextProvider.js";
import URLContextProvider from "./URLContextProvider.js";
import RelativeFileContextProvider from "./RelativeFileContextProvider.js";
import RelativeGitFileContextProvider from "./RelativeGitFileContextProvider.js";
import FileContextProvider from "./FileContextProvider.js";

=======
import { BaseContextProvider } from "../";
import { ContextProviderName } from "../../";

import ClipboardContextProvider from "./ClipboardContextProvider";
import CodeContextProvider from "./CodeContextProvider";
import ContinueProxyContextProvider from "./ContinueProxyContextProvider";
import CurrentFileContextProvider from "./CurrentFileContextProvider";
import DatabaseContextProvider from "./DatabaseContextProvider";
import DebugLocalsProvider from "./DebugLocalsProvider";
import DiffContextProvider from "./DiffContextProvider";
import DiscordContextProvider from "./DiscordContextProvider";
import DocsContextProvider from "./DocsContextProvider";
import FileTreeContextProvider from "./FileTreeContextProvider";
import FolderContextProvider from "./FolderContextProvider";
import GitCommitContextProvider from "./GitCommitContextProvider";
import GitHubIssuesContextProvider from "./GitHubIssuesContextProvider";
import GitLabMergeRequestContextProvider from "./GitLabMergeRequestContextProvider";
import GoogleContextProvider from "./GoogleContextProvider";
import GreptileContextProvider from "./GreptileContextProvider";
import HttpContextProvider from "./HttpContextProvider";
import JiraIssuesContextProvider from "./JiraIssuesContextProvider/";
import MCPContextProvider from "./MCPContextProvider";
import OpenFilesContextProvider from "./OpenFilesContextProvider";
import OSContextProvider from "./OSContextProvider";
import PostgresContextProvider from "./PostgresContextProvider";
import ProblemsContextProvider from "./ProblemsContextProvider";
import RepoMapContextProvider from "./RepoMapContextProvider";
import SearchContextProvider from "./SearchContextProvider";
import TerminalContextProvider from "./TerminalContextProvider";
import URLContextProvider from "./URLContextProvider";
import WebContextProvider from "./WebContextProvider";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

/**
 * Note: We are currently omitting the following providers due to bugs:
 * - `CodeOutlineContextProvider`
 * - `CodeHighlightsContextProvider`
 *
 * See this issue for details: https://github.com/continuedev/continue/issues/1365
 */
<<<<<<< HEAD
const Providers: (typeof BaseContextProvider)[] = [
  FileContextProvider,
=======
export const Providers: (typeof BaseContextProvider)[] = [
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  DiffContextProvider,
  FileTreeContextProvider,
  GitHubIssuesContextProvider,
  GoogleContextProvider,
  TerminalContextProvider,
  DebugLocalsProvider,
  OpenFilesContextProvider,
  HttpContextProvider,
  SearchContextProvider,
  OSContextProvider,
  ProblemsContextProvider,
  FolderContextProvider,
  DocsContextProvider,
  GitLabMergeRequestContextProvider,
  JiraIssuesContextProvider,
  PostgresContextProvider,
  DatabaseContextProvider,
  CodeContextProvider,
  CurrentFileContextProvider,
  URLContextProvider,
  ContinueProxyContextProvider,
<<<<<<< HEAD
  RelativeFileContextProvider,
  RelativeGitFileContextProvider,
  CodebaseContextProvider
=======
  RepoMapContextProvider,
  DiscordContextProvider,
  GreptileContextProvider,
  WebContextProvider,
  MCPContextProvider,
  GitCommitContextProvider,
  ClipboardContextProvider,
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
];

export function contextProviderClassFromName(
  name: ContextProviderName,
): typeof BaseContextProvider | undefined {
  return Providers.find((cls) => cls.description.title === name);
}
