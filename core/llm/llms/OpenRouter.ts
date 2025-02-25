<<<<<<< HEAD
import { LLMOptions, ModelProvider } from "../../index.js";
import OpenAI from "./OpenAI.js";

class OpenRouter extends OpenAI {
  static providerName: ModelProvider = "openrouter";
  static defaultOptions: Partial<LLMOptions> = {
    ...OpenAI.defaultOptions,
    apiBase: "https://openrouter.ai/api/v1/",
    model: "",
    useLegacyCompletionsEndpoint: false,
  };

  protected _getHeaders() {
    return {
      ...super._getHeaders(),
      "HTTP-Referer": "https://github.com/trypear/pearai-submodule",
      "X-Title": "pearai",
    };
  }
=======
import { LLMOptions } from "../../index.js";
import { osModelsEditPrompt } from "../templates/edit.js";

import OpenAI from "./OpenAI.js";

class OpenRouter extends OpenAI {
  static providerName = "openrouter";
  static defaultOptions: Partial<LLMOptions> = {
    apiBase: "https://openrouter.ai/api/v1/",
    model: "gpt-4o-mini",
    promptTemplates: {
      edit: osModelsEditPrompt,
    },
    useLegacyCompletionsEndpoint: false,
  };
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
}

export default OpenRouter;
