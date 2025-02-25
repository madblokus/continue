import * as fs from "fs";
<<<<<<< HEAD
import { PersistedSessionInfo, SessionInfo, IntegrationType, IntegrationHistoryMap } from "../index.js";
=======

import { Session, SessionMetadata } from "../index.js";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import { ListHistoryOptions } from "../protocol/core.js";

import { NEW_SESSION_TITLE } from "./constants.js";
import { getSessionFilePath, getSessionsListPath } from "./paths.js";
function safeParseArray<T>(
  value: string,
  errorMessage: string = "Error parsing array",
): T[] | undefined {
  try {
    return JSON.parse(value) as T[];
  } catch (e: any) {
    console.warn(`${errorMessage}: ${e}`);
    return undefined;
  }
}

class HistoryManager {
<<<<<<< HEAD
  private readonly integrationHistoryTypes: IntegrationHistoryMap = {
    history: 'continue',
    perplexityHistory: 'perplexity',
  };

  getHistoryType(session: PersistedSessionInfo): IntegrationType {
    // Type-safe way to check histories
    for (const key of Object.keys(this.integrationHistoryTypes) as (keyof IntegrationHistoryMap)[]) {
      if (session[key]?.length > 0) {
        return this.integrationHistoryTypes[key];
      }
    }
    return 'continue'; // Default to main if no histories found
  };

  list(options: ListHistoryOptions): SessionInfo[] {
=======
  list(options: ListHistoryOptions): SessionMetadata[] {
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    const filepath = getSessionsListPath();
    if (!fs.existsSync(filepath)) {
      return [];
    }
    const content = fs.readFileSync(filepath, "utf8");

    let sessions = safeParseArray<SessionMetadata>(content) ?? [];
    sessions = sessions.filter((session: any) => {
      // Filter out old format
      return typeof session.session_id !== "string";
    });

    // Apply limit and offset
    if (options.limit) {
      const offset = options.offset || 0;
      sessions = sessions.slice(offset, offset + options.limit);
    }
    return sessions;
  }

  delete(sessionId: string) {
    // Delete a session
    const sessionFile = getSessionFilePath(sessionId);
    if (!fs.existsSync(sessionFile)) {
      throw new Error(`Session file ${sessionFile} does not exist`);
    }
    fs.unlinkSync(sessionFile);

    // Read and update the sessions list
    const sessionsListFile = getSessionsListPath();
    const sessionsListRaw = fs.readFileSync(sessionsListFile, "utf-8");
    let sessionsList =
      safeParseArray<SessionMetadata>(
        sessionsListRaw,
        "Error parsing sessions.json",
      ) ?? [];

    sessionsList = sessionsList.filter(
      (session) => session.sessionId !== sessionId,
    );

    fs.writeFileSync(
      sessionsListFile,
      JSON.stringify(sessionsList, undefined, 2),
    );
  }

  load(sessionId: string): Session {
    try {
      const sessionFile = getSessionFilePath(sessionId);
      if (!fs.existsSync(sessionFile)) {
        throw new Error(`Session file ${sessionFile} does not exist`);
      }
      const session: Session = JSON.parse(fs.readFileSync(sessionFile, "utf8"));
      session.sessionId = sessionId;
      return session;
    } catch (e) {
      console.log(`Error loading session: ${e}`);
      return {
        history: [],
<<<<<<< HEAD
        perplexityHistory: [],
        title: "Failed to load session",
=======
        title: NEW_SESSION_TITLE,
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        workspaceDirectory: "",
        sessionId: sessionId,
      };
    }
  }

  save(session: Session) {
    // Save the main session json file
    // Explicitely rewriting here to influence the written key order in the file!
    // e.g. id at the top, history next, etc.
    const orderedSession: Session = {
      sessionId: session.sessionId,
      title: session.title,
      workspaceDirectory: session.workspaceDirectory,
      history: session.history,
    };
    fs.writeFileSync(
      getSessionFilePath(session.sessionId),
      JSON.stringify(orderedSession, undefined, 2),
    );

    // Read and update the sessions list
    const sessionsListFilePath = getSessionsListPath();
    try {
      const rawSessionsList = fs.readFileSync(sessionsListFilePath, "utf-8");

      let sessionsList: SessionMetadata[];
      try {
        sessionsList = JSON.parse(rawSessionsList);
      } catch (e) {
        if (rawSessionsList.trim() === "") {
          fs.writeFileSync(sessionsListFilePath, JSON.stringify([]));
          sessionsList = [];
        } else {
          throw e;
        }
      }

      // todo: add a parameter to indicate integration type of session
      let found = false;
<<<<<<< HEAD
      for (const sessionInfo of sessionsList) {
        if (sessionInfo.sessionId === session.sessionId) {
          sessionInfo.title = session.title;
          sessionInfo.workspaceDirectory = session.workspaceDirectory;
          sessionInfo.integrationType = this.getHistoryType(session); // return integration type;
=======
      for (const sessionMetadata of sessionsList) {
        if (sessionMetadata.sessionId === session.sessionId) {
          sessionMetadata.title = session.title;
          sessionMetadata.workspaceDirectory = session.workspaceDirectory;
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
          found = true;
          break;
        }
      }

      if (!found) {
        const sessionMetadata: SessionMetadata = {
          sessionId: session.sessionId,
          title: session.title,
          dateCreated: String(Date.now()),
          workspaceDirectory: session.workspaceDirectory,
          integrationType: this.getHistoryType(session),
        };
        sessionsList.push(sessionMetadata);
      }

      fs.writeFileSync(
        sessionsListFilePath,
        JSON.stringify(sessionsList, undefined, 2),
      );
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(
          `It looks like there is a JSON formatting error in your sessions.json file (${sessionsListFilePath}). Please fix this before creating a new session.`,
        );
      }
      throw new Error(
        `It looks like there is a validation error in your sessions.json file (${sessionsListFilePath}). Please fix this before creating a new session. Error: ${error}`,
      );
    }
  }
}

const historyManager = new HistoryManager();

export default historyManager;
