import { ConfigHandler } from "core/config/ConfigHandler";
import Ollama from "core/llm/llms/Ollama";
import { GlobalContext } from "core/util/GlobalContext";

import type { ILLM } from "core";

export class TabAutocompleteModel {
  private _llm: ILLM | undefined;
  private defaultTag = "qwen2.5-coder:1.5b";
  private globalContext: GlobalContext = new GlobalContext();

  constructor(private configHandler: ConfigHandler) {}

  clearLlm() {
    this._llm = undefined;
  }

  async getDefaultTabAutocompleteModel() {
    const llm = new Ollama({
      model: this.defaultTag,
    });

    try {
      const models = await llm.listModels();
      if (!models.includes(this.defaultTag)) {
<<<<<<< HEAD
        if (!this.shownDeepseekWarning) {
          vscode.window
            .showWarningMessage(
              `Your local Ollama instance doesn't yet have ${this.defaultTagName}. To download this model, run \`ollama run ${this.defaultTag}\` (recommended). If you'd like to use a custom model for tab autocomplete, learn more in the docs`,
              "Documentation",
              "Copy Command",
            )
            .then((value) => {
              if (value === "Documentation") {
                vscode.env.openExternal(
                  vscode.Uri.parse(
                    "https://trypear.ai/docs/tab-autocomplete",
                  ),
                );
              } else if (value === "Copy Command") {
                vscode.env.clipboard.writeText(`ollama run ${this.defaultTag}`);
              }
            });
          this.shownDeepseekWarning = true;
        }
=======
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
        return undefined;
      }
    } catch (e) {
      return undefined;
    }

    return llm;
  }

  async get() {
    if (!this._llm) {
      const { config } = await this.configHandler.loadConfig();
      if (!config) {
        return undefined;
      }

      if (config.tabAutocompleteModels?.length) {
        const selected = this.globalContext.get("selectedTabAutocompleteModel");
        if (selected) {
          this._llm =
            config.tabAutocompleteModels?.find(
              (model) => model.title === selected,
            ) ?? config.tabAutocompleteModels?.[0];
        } else {
          if (config.tabAutocompleteModels[0].title) {
            this.globalContext.update(
              "selectedTabAutocompleteModel",
              config.tabAutocompleteModels[0].title,
            );
          }
          this._llm = config.tabAutocompleteModels[0];
        }
      } else {
        this._llm = await this.getDefaultTabAutocompleteModel();
      }
    }

    return this._llm;
  }
}
