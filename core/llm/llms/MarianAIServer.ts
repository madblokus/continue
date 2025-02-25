/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {
  ChatMessage,
  CompletionOptions,
  LLMOptions,
  ModelProvider,
  PearAuth,
} from "../../index.js";
import { BaseLLM } from "../index.js";
import { streamSse, streamResponse, streamJSON } from "../stream.js";
import { stripImages } from "../images.js";
import {
  compileChatMessages,
  countTokens,
  pruneRawPromptFromTop,
} from "./../countTokens.js";
import { MarianAICredentials } from "../../marianaiServer/MarianAICredentials.js";
import { readConfigJson } from "../../util/paths.js";
import { execSync } from "child_process";
import * as vscode from "vscode";

// Get the MarianAI server URL from environment or config
const MARIANAI_SERVER_URL =
  process.env.MARIANAI_SERVER_URL || "https://your-marianai-server.com";

class MarianAIServer extends BaseLLM {
  private credentials: MarianAICredentials;

  static providerName: ModelProvider = "marianai_server";

  constructor(options: LLMOptions) {
    super(options);
    this.credentials = new MarianAICredentials(
      options.getCredentials,
      options.setCredentials || (async () => {}),
    );
  }

  public setMarianAIAccessToken(value: string | undefined): void {
    this.credentials.setAccessToken(value);
  }

  public setMarianAIRefreshToken(value: string | undefined): void {
    this.credentials.setRefreshToken(value);
  }

  private async _getHeaders() {
    await this.credentials.checkAndUpdateCredentials();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.credentials.getAccessToken()}`,
    };
  }

  private async _countTokens(prompt: string, model: string, isPrompt: boolean) {
    // no-op for now - implement token counting specific to your models if needed
  }

  public static _getRepoId(): string {
    try {
      const gitRepo = vscode.workspace.workspaceFolders?.[0];
      if (gitRepo) {
        try {
          // First check if git is initialized and has commits
          const hasCommits = execSync("git rev-parse --verify HEAD", {
            cwd: gitRepo.uri.fsPath,
          })
            .toString()
            .trim();

          if (hasCommits) {
            // If we have commits, get the root commit hash
            const rootCommitHash = execSync(
              "git rev-list --max-parents=0 HEAD -n 1",
              { cwd: gitRepo.uri.fsPath },
            )
              .toString()
              .trim()
              .substring(0, 7);
            return rootCommitHash;
          }
        } catch (gitError) {
          console.debug("Git repository not initialized or no commits present");
        }
      }
      return "global";
    } catch (error) {
      console.error("Failed to initialize project ID:", error);
      console.error("Using user ID as project ID");
      return "global";
    }
  }

  private _convertArgs(options: CompletionOptions): any {
    return {
      model: options.model,
      integrations: readConfigJson().integrations || {},
      repoId: MarianAIServer._getRepoId(),
      frequency_penalty: options.frequencyPenalty,
      presence_penalty: options.presencePenalty,
      max_tokens: options.maxTokens,
      stop: options.stop,
      temperature: options.temperature,
      top_p: options.topP,
    };
  }

  protected async *_streamComplete(
    prompt: string,
    options: CompletionOptions,
  ): AsyncGenerator<string> {
    for await (const chunk of this._streamChat(
      [{ role: "user", content: prompt }],
      options,
    )) {
      yield stripImages(chunk.content);
    }
  }

  countTokens(text: string): number {
    return countTokens(text, this.model);
  }

  protected _convertMessage(message: ChatMessage) {
    if (typeof message.content === "string") {
      return message;
    }
    return {
      ...message,
      content: message.content.map((part) => {
        if (part.type === "text") {
          return part;
        }
        return {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/jpeg",
            data: part.imageUrl?.url.split(",")[1],
          },
        };
      }),
    };
  }

  protected async *_streamChat(
    messages: ChatMessage[],
    options: CompletionOptions,
  ): AsyncGenerator<ChatMessage> {
    const args = this._convertArgs(this.collectArgs(options));

    await this._countTokens(
      messages.map((m) => m.content).join("\n"),
      args.model,
      true,
    );

    await this.credentials.checkAndUpdateCredentials();

    const body = JSON.stringify({
      messages: messages.map(this._convertMessage),
      ...args,
    });

    const response = await this.fetch(`${MARIANAI_SERVER_URL}/chat`, {
      method: "POST",
      headers: await this._getHeaders(),
      body: body,
    });

    let completion = "";

    for await (const value of streamJSON(response)) {
      if (value.content) {
        yield {
          role: "assistant",
          content: value.content,
          citations: value?.citations,
        };
        completion += value.content;
      }
    }

    this._countTokens(completion, args.model, false);
  }

  async *_streamFim(
    prefix: string,
    suffix: string,
    options: CompletionOptions,
  ): AsyncGenerator<string> {
    options.stream = true;

    const user_logged_in = await this.credentials.checkAndUpdateCredentials();
    if (!user_logged_in) {
      return null;
    }

    const endpoint = `${MARIANAI_SERVER_URL}/fim`;
    const resp = await this.fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        model: options.model,
        prefix,
        suffix,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        stop: options.stop,
        stream: true,
      }),
      headers: await this._getHeaders(),
    });

    let completion = "";
    for await (const chunk of streamSse(resp)) {
      yield chunk.choices[0].delta.content;
      completion += chunk.choices[0].delta.content;
    }
    this._countTokens(completion, options.model, false);
  }
}
