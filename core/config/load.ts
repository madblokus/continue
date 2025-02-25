import { execSync } from "child_process";
import * as fs from "fs";
import os from "os";
import path from "path";

import { fetchwithRequestOptions } from "@continuedev/fetch";
import * as JSONC from "comment-json";
import * as tar from "tar";

import {
  BrowserSerializedContinueConfig,
  Config,
  ContextProviderWithParams,
  ContinueConfig,
  ContinueRcJson,
  CustomContextProvider,
  CustomLLM,
  EmbeddingsProviderDescription,
  IContextProvider,
  IDE,
  IdeSettings,
  IdeType,
  ILLM,
  LLMOptions,
  ModelDescription,
  RerankerDescription,
  SerializedContinueConfig,
  SlashCommand,
<<<<<<< HEAD
  PearAuth,
} from "../index.js";
import TransformersJsEmbeddingsProvider from "../indexing/embeddings/TransformersJsEmbeddingsProvider.js";
import { allEmbeddingsProviders } from "../indexing/embeddings/index.js";
import { BaseLLM } from "../llm/index.js";
import CustomLLMClass from "../llm/llms/CustomLLM.js";
import FreeTrial from "../llm/llms/FreeTrial.js";
import { llmFromDescription } from "../llm/llms/index.js";

import { execSync } from "child_process";
import CodebaseContextProvider from "../context/providers/CodebaseContextProvider.js";
import ContinueProxyContextProvider from "../context/providers/ContinueProxyContextProvider.js";
import { fetchwithRequestOptions } from "../util/fetchWithOptions.js";
import { copyOf } from "../util/index.js";
import mergeJson from "../util/merge.js";
=======
} from "..";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import {
  slashCommandFromDescription,
  slashFromCustomCommand,
} from "../commands/index.js";
import { AllRerankers } from "../context/allRerankers";
import { MCPManagerSingleton } from "../context/mcp";
import ContinueProxyContextProvider from "../context/providers/ContinueProxyContextProvider";
import CustomContextProviderClass from "../context/providers/CustomContextProvider";
import FileContextProvider from "../context/providers/FileContextProvider";
import { contextProviderClassFromName } from "../context/providers/index";
import PromptFilesContextProvider from "../context/providers/PromptFilesContextProvider";
import { allEmbeddingsProviders } from "../indexing/allEmbeddingsProviders";
import { BaseLLM } from "../llm";
import { llmFromDescription } from "../llm/llms";
import CustomLLMClass from "../llm/llms/CustomLLM";
import FreeTrial from "../llm/llms/FreeTrial";
import { LLMReranker } from "../llm/llms/llm";
import TransformersJsEmbeddingsProvider from "../llm/llms/TransformersJsEmbeddingsProvider";
import { slashCommandFromPromptFileV1 } from "../promptFiles/v1/slashCommandFromPromptFile";
import { getAllPromptFiles } from "../promptFiles/v2/getPromptFiles";
import { allTools } from "../tools";
import { copyOf } from "../util";
import { GlobalContext } from "../util/GlobalContext";
import mergeJson from "../util/merge";
import {
  DEFAULT_CONFIG_TS_CONTENTS,
  getConfigJsonPath,
  getConfigJsonPathForRemote,
  getConfigJsPath,
  getConfigJsPathForRemote,
  getConfigTsPath,
  getContinueDotEnv,
<<<<<<< HEAD
  readAllGlobalPromptFiles,
  editConfigJson
} from "../util/paths.js";
=======
  getEsbuildBinaryPath,
} from "../util/paths";

import { ConfigResult, ConfigValidationError } from "@continuedev/config-yaml";
import { useHub } from "../control-plane/env";
import { localPathToUri } from "../util/pathToUri";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import {
  defaultConfig,
  defaultContextProvidersJetBrains,
  defaultContextProvidersVsCode,
  defaultSlashCommandsJetBrains,
  defaultSlashCommandsVscode,
<<<<<<< HEAD
  defaultCustomCommands,
} from "./default.js";
import {
  DEFAULT_PROMPTS_FOLDER,
  getPromptFiles,
  slashCommandFromPromptFile,
} from "./promptFile.js";
import { SERVER_URL } from "../util/parameters";
=======
} from "./default";
import { getSystemPromptDotFile } from "./getSystemPromptDotFile";
import { modifyContinueConfigWithSharedConfig } from "./sharedConfig";
import { validateConfig } from "./validation.js";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

export function resolveSerializedConfig(
  filepath: string,
): SerializedContinueConfig {
  let content = fs.readFileSync(filepath, "utf8");

  // Replace "pearai-server" with "pearai_server" at the beginning
  // This is to make v0.0.3 backwards compatible with v0.0.2
  content = content.replace(/"pearai-server"/g, '"pearai_server"');

  const config = JSONC.parse(content) as unknown as SerializedContinueConfig;
  if (config.env && Array.isArray(config.env)) {
    const env = {
      ...process.env,
      ...getContinueDotEnv(),
    };

    config.env.forEach((envVar) => {
      if (envVar in env) {
        content = (content as any).replaceAll(
          new RegExp(`"${envVar}"`, "g"),
          `"${env[envVar]}"`,
        );
      }
    });
  }

  return JSONC.parse(content) as unknown as SerializedContinueConfig;
}

const configMergeKeys = {
  models: (a: any, b: any) => a.title === b.title,
  contextProviders: (a: any, b: any) => a.name === b.name,
  slashCommands: (a: any, b: any) => a.name === b.name,
  customCommands: (a: any, b: any) => a.name === b.name,
};

function loadSerializedConfig(
  workspaceConfigs: ContinueRcJson[],
  ideSettings: IdeSettings,
  ideType: IdeType,
  overrideConfigJson: SerializedContinueConfig | undefined,
  ide: IDE,
): ConfigResult<SerializedContinueConfig> {
  let config: SerializedContinueConfig = overrideConfigJson!;
  if (!config) {
    try {
      config = resolveSerializedConfig(getConfigJsonPath(ideType));
    } catch (e) {
      throw new Error(`Failed to parse config.json: ${e}`);
    }
  }

  const errors = validateConfig(config);

  if (errors?.some((error) => error.fatal)) {
    return {
      errors,
      config: undefined,
      configLoadInterrupted: true,
    };
  }

  if (config.allowAnonymousTelemetry === undefined) {
    config.allowAnonymousTelemetry = true;
  }

  // If integrations doesn't exist in config, write it to config.json
  if (!config.integrations) {
    config.integrations = [];
  }

  if (ideSettings.remoteConfigServerUrl) {
    try {
      const remoteConfigJson = resolveSerializedConfig(
        getConfigJsonPathForRemote(ideSettings.remoteConfigServerUrl),
      );
      config = mergeJson(config, remoteConfigJson, "merge", configMergeKeys);
    } catch (e) {
      console.warn("Error loading remote config: ", e);
    }
  }

  for (const workspaceConfig of workspaceConfigs) {
    config = mergeJson(
      config,
      workspaceConfig,
      workspaceConfig.mergeBehavior,
      configMergeKeys,
    );
  }

  // Set defaults if undefined (this lets us keep config.json uncluttered for new users)
  config.contextProviders ??=
    ideType === "vscode"
      ? [...defaultContextProvidersVsCode]
      : [...defaultContextProvidersJetBrains];

  // Slash commands are only added for existing installs if config.json is empty.
  config.slashCommands ??=
    ideType === "vscode"
      ? [...defaultSlashCommandsVscode]
      : [...defaultSlashCommandsJetBrains];

  // Temporarily disabling this check until we can verify the commands are accuarate
  // if (!isSupportedLanceDbCpuTarget(ide)) {
  //   config.disableIndexing = true;
  // }

  return { config, errors, configLoadInterrupted: false };
}

async function serializedToIntermediateConfig(
  initial: SerializedContinueConfig,
  ide: IDE,
): Promise<Config> {
  // DEPRECATED - load custom slash commands
  const slashCommands: SlashCommand[] = [];
  for (const command of initial.slashCommands || []) {
    const newCommand = slashCommandFromDescription(command);
    if (newCommand) {
      slashCommands.push(newCommand);
    }
  }
  for (const command of initial.customCommands || []) {
    slashCommands.push(slashFromCustomCommand(command));
  }

  // DEPRECATED - load slash commands from v1 prompt files
  // NOTE: still checking the v1 default .prompts folder for slash commands
  const promptFiles = await getAllPromptFiles(
    ide,
    initial.experimental?.promptPath,
    true,
  );

<<<<<<< HEAD
  if (loadPromptFiles) {
    let promptFiles: { path: string; content: string } [] = [];
    promptFiles = (
      await Promise.all(
        workspaceDirs.map((dir) =>
          getPromptFiles(
            ide,
            path.join(dir, promptFolder ?? DEFAULT_PROMPTS_FOLDER),
          ),
        ),
      )
    )
      .flat()
      .filter(({ path }) => path.endsWith(".prompt"));

    // Also read from ~/.pearai/.prompts
    promptFiles.push(...readAllGlobalPromptFiles());

    for (const file of promptFiles) {
      slashCommands.push(slashCommandFromPromptFile(file.path, file.content));
=======
  for (const file of promptFiles) {
    const slashCommand = slashCommandFromPromptFileV1(file.path, file.content);
    if (slashCommand) {
      slashCommands.push(slashCommand);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    }
  }

  const config: Config = {
    ...initial,
    slashCommands,
    contextProviders: initial.contextProviders || [],
  };

  return config;
}

function isModelDescription(
  llm: ModelDescription | CustomLLM,
): llm is ModelDescription {
  return (llm as ModelDescription).title !== undefined;
}

export function isContextProviderWithParams(
  contextProvider: CustomContextProvider | ContextProviderWithParams,
): contextProvider is ContextProviderWithParams {
  return (contextProvider as ContextProviderWithParams).name !== undefined;
}

const getCodebaseProvider = async (params: any) => {
  const { default: CodebaseContextProvider } = await import(
    "../context/providers/CodebaseContextProvider"
  );
  return new CodebaseContextProvider(params);
};

/** Only difference between intermediate and final configs is the `models` array */
async function intermediateToFinalConfig(
  config: Config,
  ide: IDE,
  ideSettings: IdeSettings,
  uniqueId: string,
  writeLog: (log: string) => Promise<void>,
  workOsAccessToken: string | undefined,
<<<<<<< HEAD
  allowFreeTrial: boolean = false,
): Promise<ContinueConfig> {
=======
  loadPromptFiles: boolean = true,
  allowFreeTrial: boolean = true,
): Promise<{ config: ContinueConfig; errors: ConfigValidationError[] }> {
  const errors: ConfigValidationError[] = [];

>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  // Auto-detect models
  let models: BaseLLM[] = [];
  for (const desc of config.models) {
    if (isModelDescription(desc)) {
      const llm = await llmFromDescription(
        desc,
        ide.readFile.bind(ide),
        uniqueId,
        ideSettings,
        writeLog,
        config.completionOptions,
        config.systemMessage,
        ide.getCurrentDirectory.bind(ide),
        async () => await ide.getPearAuth(),
        async (auth: PearAuth) => await ide.updatePearCredentials(auth),
      );
      if (!llm) {
        continue;
      }

      if (llm.model === "AUTODETECT") {
        try {
          const modelNames = await llm.listModels();
          const detectedModels = await Promise.all(
            modelNames.map(async (modelName) => {
              return await llmFromDescription(
                {
                  ...desc,
                  model: modelName,
                  title: `${llm.title} - ${modelName}`,
                },
                ide.readFile.bind(ide),
                uniqueId,
                ideSettings,
                writeLog,
                copyOf(config.completionOptions),
                config.systemMessage,
              );
            }),
          );
          models.push(
            ...(detectedModels.filter(
              (x) => typeof x !== "undefined",
            ) as BaseLLM[]),
          );
        } catch (e) {
          console.warn("Error listing models: ", e);
        }
      } else {
        models.push(llm);
      }
    } else {
      const llm = new CustomLLMClass({
        ...desc,
        options: { ...desc.options, writeLog } as any,
      });
      if (llm.model === "AUTODETECT") {
        try {
          const modelNames = await llm.listModels();
          const models = modelNames.map(
            (modelName) =>
              new CustomLLMClass({
                ...desc,
                options: { ...desc.options, model: modelName, writeLog },
              }),
          );

          models.push(...models);
        } catch (e) {
          console.warn("Error listing models: ", e);
        }
      } else {
        models.push(llm);
      }
    }
  }

  // Prepare models
  for (const model of models) {
    model.requestOptions = {
      ...model.requestOptions,
      ...config.requestOptions,
    };
    model.roles = model.roles ?? ["chat"]; // Default to chat role if not specified
  }

  if (allowFreeTrial) {
    // Obtain auth token (iff free trial being used)
    const freeTrialModels = models.filter(
      (model) => model.providerName === "free-trial",
    );
    if (freeTrialModels.length > 0) {
      const ghAuthToken = await ide.getGitHubAuthToken({});
      for (const model of freeTrialModels) {
        (model as FreeTrial).setupGhAuthToken(ghAuthToken);
      }
    }
    console.log("Free trial models:", freeTrialModels);
  } else {
    // Remove free trial models
    models = models.filter((model) => model.providerName !== "free-trial");
    console.log("Models:", models);
  }

  // Tab autocomplete model
  let tabAutocompleteModels: BaseLLM[] = [];
  if (config.tabAutocompleteModel) {
    tabAutocompleteModels = (
      await Promise.all(
        (Array.isArray(config.tabAutocompleteModel)
          ? config.tabAutocompleteModel
          : [config.tabAutocompleteModel]
        ).map(async (desc) => {
          if (isModelDescription(desc)) {
            const llm = await llmFromDescription(
              desc,
              ide.readFile.bind(ide),
              uniqueId,
              ideSettings,
              writeLog,
              config.completionOptions,
              config.systemMessage,
            );

<<<<<<< HEAD
            // if (llm?.providerName === "free-trial") {
            //   if (!allowFreeTrial) {
            //     // This shouldn't happen
            //     throw new Error("Free trial cannot be used with control plane");
            //   }
            //   const ghAuthToken = await ide.getGitHubAuthToken();
            //   (llm as FreeTrial).setupGhAuthToken(ghAuthToken);
            // }
=======
            if (llm?.providerName === "free-trial") {
              if (!allowFreeTrial) {
                // This shouldn't happen
                throw new Error("Free trial cannot be used with control plane");
              }
              const ghAuthToken = await ide.getGitHubAuthToken({});
              (llm as FreeTrial).setupGhAuthToken(ghAuthToken);
            }
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
            return llm;
          } else {
            return new CustomLLMClass(desc);
          }
        }),
      )
    ).filter((x) => x !== undefined) as BaseLLM[];
  }

  // These context providers are always included, regardless of what, if anything,
  // the user has configured in config.json
<<<<<<< HEAD
  const DEFAULT_CONTEXT_PROVIDERS : any[] = [
    // new FileContextProvider({}),
    // new CodebaseContextProvider({}),
=======

  const codebaseContextParams =
    (
      (config.contextProviders || [])
        .filter(isContextProviderWithParams)
        .find((cp) => cp.name === "codebase") as
        | ContextProviderWithParams
        | undefined
    )?.params || {};

  const DEFAULT_CONTEXT_PROVIDERS = [
    new FileContextProvider({}),
    // Add codebase provider if indexing is enabled
    ...(!config.disableIndexing
      ? [await getCodebaseProvider(codebaseContextParams)]
      : []),
    // Add prompt files provider if enabled
    ...(loadPromptFiles ? [new PromptFilesContextProvider({})] : []),
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  ];

  const DEFAULT_CONTEXT_PROVIDERS_TITLES = DEFAULT_CONTEXT_PROVIDERS.map(
    ({ description: { title } }) => title,
  );

  // Context providers
  const contextProviders: IContextProvider[] = DEFAULT_CONTEXT_PROVIDERS;

  for (const provider of config.contextProviders || []) {
    if (isContextProviderWithParams(provider)) {
      const cls = contextProviderClassFromName(provider.name) as any;
      if (!cls) {
        if (!DEFAULT_CONTEXT_PROVIDERS_TITLES.includes(provider.name)) {
          console.warn(`Unknown context provider ${provider.name}`);
        }

        continue;
      }
      const instance: IContextProvider = new cls(provider.params);

      // Handle continue-proxy
      if (instance.description.title === "continue-proxy") {
        (instance as ContinueProxyContextProvider).workOsAccessToken =
          workOsAccessToken;
      }

      contextProviders.push(instance);
    } else {
      contextProviders.push(new CustomContextProviderClass(provider));
    }
  }

  // Embeddings Provider
  const embeddingsProviderDescription = config.embeddingsProvider as
    | EmbeddingsProviderDescription
    | undefined;
  if (embeddingsProviderDescription?.provider) {
    const { provider, ...options } = embeddingsProviderDescription;
    const embeddingsProviderClass = allEmbeddingsProviders[provider];
    if (embeddingsProviderClass) {
      if (
        embeddingsProviderClass.name === "_TransformersJsEmbeddingsProvider"
      ) {
        config.embeddingsProvider = new embeddingsProviderClass();
      } else {
        const llmOptions: LLMOptions = {
          model: options.model ?? "UNSPECIFIED",
          ...options,
        };
        config.embeddingsProvider = new embeddingsProviderClass(
          llmOptions,
          (url: string | URL, init: any) =>
            fetchwithRequestOptions(url, init, {
              ...config.requestOptions,
              ...options.requestOptions,
            }),
        );
      }
    }
  }

  if (!config.embeddingsProvider) {
    config.embeddingsProvider = new TransformersJsEmbeddingsProvider();
  }

  // Reranker
  if (config.reranker && !(config.reranker as ILLM | undefined)?.rerank) {
    const { name, params } = config.reranker as RerankerDescription;
    const rerankerClass = AllRerankers[name];

    if (name === "llm") {
      const llm = models.find((model) => model.title === params?.modelTitle);
      if (!llm) {
        console.warn(`Unknown model ${params?.modelTitle}`);
      } else {
        config.reranker = new LLMReranker(llm);
      }
    } else if (rerankerClass) {
      const llmOptions: LLMOptions = {
        model: "rerank-2",
        ...params,
      };
      config.reranker = new rerankerClass(llmOptions);
    }
  }

  let continueConfig: ContinueConfig = {
    ...config,
    contextProviders,
    models,
    embeddingsProvider: config.embeddingsProvider as any,
    tabAutocompleteModels,
    reranker: config.reranker as any,
    tools: allTools,
  };

  // Apply MCP if specified
  const mcpManager = MCPManagerSingleton.getInstance();
  if (config.experimental?.modelContextProtocolServers) {
    await Promise.all(
      config.experimental.modelContextProtocolServers?.map(
        async (server, index) => {
          const mcpId = index.toString();
          const mcpConnection = mcpManager.createConnection(mcpId, server);
          if (!mcpConnection) {
            return;
          }

          const abortController = new AbortController();

          try {
            const mcpError = await mcpConnection.modifyConfig(
              continueConfig,
              mcpId,
              abortController.signal,
              "MCP Server",
              server.faviconUrl,
            );
            if (mcpError) {
              errors.push(mcpError);
            }
          } catch (e: any) {
            errors.push({
              fatal: false,
              message: `Failed to load MCP server: ${e.message}`,
            });
            if (e.name !== "AbortError") {
              throw e;
            }
          }
        },
      ) || [],
    );
  }

  return { config: continueConfig, errors };
}

async function finalToBrowserConfig(
  final: ContinueConfig,
  ide: IDE,
): Promise<BrowserSerializedContinueConfig> {
  return {
    allowAnonymousTelemetry: final.allowAnonymousTelemetry,
    models: final.models.map((m) => ({
      title: m.title ?? m.model,
      provider: m.providerName,
      model: m.model,
      apiKey: m.apiKey,
      apiBase: m.apiBase,
      refreshToken: m.refreshToken,
      contextLength: m.contextLength,
      template: m.template,
      completionOptions: m.completionOptions,
      systemMessage: m.systemMessage,
      requestOptions: m.requestOptions,
      promptTemplates: m.promptTemplates as any,
      capabilities: m.capabilities,
<<<<<<< HEAD
      isDefault: m.isDefault,
=======
      roles: m.roles,
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    })),
    systemMessage: final.systemMessage,
    completionOptions: final.completionOptions,
    slashCommands: final.slashCommands?.map((s) => ({
      name: s.name,
      description: s.description,
      params: s.params, //PZTODO: is this why params aren't referenced properly by slash commands?
    })),
    contextProviders: final.contextProviders?.map((c) => c.description),
    disableIndexing: final.disableIndexing,
    disableSessionTitles: final.disableSessionTitles,
    userToken: final.userToken,
    embeddingsProvider: final.embeddingsProvider?.embeddingId,
    ui: final.ui,
    experimental: final.experimental,
<<<<<<< HEAD
    isBetaAccess: final?.isBetaAccess,
    integrations: final.integrations || []
=======
    docs: final.docs,
    tools: final.tools,
    tabAutocompleteOptions: final.tabAutocompleteOptions,
    usePlatform: await useHub(ide.getIdeSettings()),
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  };
}

function escapeSpacesInPath(p: string): string {
  return p
    .split("")
    .map((char) => {
      if (char === " ") {
        return "\\ ";
      } else if (char === "\\") {
        return "\\\\";
      } else {
        return char;
      }
    })
    .join("");
}

async function handleEsbuildInstallation(ide: IDE, ideType: IdeType) {
  // JetBrains is currently the only IDE that we've reached the plugin size limit and
  // therefore need to install esbuild manually to reduce the size
  if (ideType !== "jetbrains") {
    return;
  }

  const globalContext = new GlobalContext();
  if (globalContext.get("hasDismissedConfigTsNoticeJetBrains")) {
    return;
  }

  const esbuildPath = getEsbuildBinaryPath();

  if (fs.existsSync(esbuildPath)) {
    return;
  }

  console.debug("No esbuild binary detected");

  const shouldInstall = await promptEsbuildInstallation(ide);

  if (shouldInstall) {
    await downloadAndInstallEsbuild(ide);
  }
}

async function promptEsbuildInstallation(ide: IDE): Promise<boolean> {
  const installMsg = "Install esbuild";
  const dismissMsg = "Dismiss";

  const res = await ide.showToast(
    "warning",
    "You're using a custom 'config.ts' file, which requires 'esbuild' to be installed. Would you like to install it now?",
    dismissMsg,
    installMsg,
  );

  if (res === dismissMsg) {
    const globalContext = new GlobalContext();
    globalContext.update("hasDismissedConfigTsNoticeJetBrains", true);
    return false;
  }

  return res === installMsg;
}

/**
 * The download logic is adapted from here: https://esbuild.github.io/getting-started/#download-a-build
 */
async function downloadAndInstallEsbuild(ide: IDE) {
  const esbuildPath = getEsbuildBinaryPath();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "esbuild-"));

  try {
    const target = `${os.platform()}-${os.arch()}`;
    const version = "0.19.11";
    const url = `https://registry.npmjs.org/@esbuild/${target}/-/${target}-${version}.tgz`;
    const tgzPath = path.join(tempDir, `esbuild-${version}.tgz`);

    console.debug(`Downloading esbuild from: ${url}`);
    execSync(`curl -fo "${tgzPath}" "${url}"`);

    console.debug(`Extracting tgz file to: ${tempDir}`);
    await tar.x({
      file: tgzPath,
      cwd: tempDir,
      strip: 2, // Remove the top two levels of directories
    });

    // Ensure the destination directory exists
    const destDir = path.dirname(esbuildPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Move the file
    const extractedBinaryPath = path.join(tempDir, "esbuild");
    fs.renameSync(extractedBinaryPath, esbuildPath);

    // Ensure the binary is executable (not needed on Windows)
    if (os.platform() !== "win32") {
      fs.chmodSync(esbuildPath, 0o755);
    }

    // Clean up
    fs.unlinkSync(tgzPath);
    fs.rmSync(tempDir, { recursive: true });

    await ide.showToast(
      "info",
      `'esbuild' successfully installed to ${esbuildPath}`,
    );
  } catch (error) {
    console.error("Error downloading or saving esbuild binary:", error);
    throw error;
  }
}

async function tryBuildConfigTs() {
  try {
    if (process.env.IS_BINARY === "true") {
      await buildConfigTsWithBinary();
    } else {
      await buildConfigTsWithNodeModule();
    }
  } catch (e) {
    console.log(
      `Build error. Please check your ~/.pearai/config.ts file: ${e}`,
    );
  }
}

<<<<<<< HEAD
async function addDefaults(config: SerializedContinueConfig) {
  await addDefaultModels(config);
  addDefaultCustomCommands(config);
  addDefaultContextProviders(config);
  addDefaultSlashCommands(config);
  addDefaultIntegrations(config);
}

function addDefaultIntegrations(config: SerializedContinueConfig): void {
  defaultConfig!.integrations!.forEach((defaultIntegration) => {
    const integrationExists = config?.integrations?.some(
      (configIntegration) =>
        configIntegration.name === defaultIntegration.name
    );
    if (!integrationExists) {
      config!.integrations!.push(defaultIntegration);
      editConfigJson((configJson) => {
        if (!configJson.integrations) {
          configJson.integrations = [];
        }
        configJson.integrations.push(defaultIntegration);
        return configJson;
      });
    }
  });
}

const STATIC_MODELS: ModelDescription[] = [
  {
    model: "pearai_model",
    contextLength: 300000,
    title: "PearAI Model (Recommended)",
    systemMessage: "You are an expert software developer. You give helpful and concise responses.",
    provider: "pearai_server",
    isDefault: true,
  },
  {
    model: "perplexity",
    title: "PearAI Search (Powered by Perplexity)",
    systemMessage: "You are an expert documentation and information gatherer. You give succinct responses based on the latest software engineering practices and documentation. Always go to the web to get the latest information and data.",
    provider: "pearai_server",
    isDefault: true,
  }
];

const getDefaultModels = async () => {
  try {
    const res = await fetch(`${SERVER_URL}/getDefaultConfig`);
    const config = await res.json();
    return config.models;
  } catch {
    return [];
  }
};

async function addDefaultModels(config: SerializedContinueConfig): Promise<void> {
  // First, add static models
  STATIC_MODELS.forEach((staticModel) => {
    const modelExists = config.models.some(
      (configModel) =>
        configModel.title === staticModel.title &&
        configModel.provider === staticModel.provider
    );

    if (!modelExists) {
      config.models.push({ ...staticModel });
    }
  });

  // Then, add dynamic models from server
  const dynamicModels = await getDefaultModels();
  dynamicModels.forEach((defaultModel: ModelDescription) => {
    const modelExists = config.models.some(
      (configModel) =>
        configModel.title === defaultModel.title &&
        configModel.provider === defaultModel.provider
    );

    if (!modelExists) {
      config.models.push({ ...defaultModel });
    }
  });
}

function addDefaultCustomCommands(config: SerializedContinueConfig): void {
  const defaultCommands = defaultCustomCommands;
  defaultCommands.forEach(defaultCommand => {
    if (!config.customCommands) {
      config.customCommands = [];
    }
    config.customCommands.push({ ...defaultCommand });
  });
}

function addDefaultContextProviders(config: SerializedContinueConfig): void {
  const defaultContextProviders = defaultContextProvidersVsCode; // or defaultContextProvidersJetBrains based on IDE type
  defaultContextProviders.forEach((defaultProvider) => {
    const providerExists = config.contextProviders?.some(
      (configProvider) => configProvider.name === defaultProvider.name,
    );

    if (!providerExists) {
      config.contextProviders = config.contextProviders || [];
      config.contextProviders.push({ ...defaultProvider });
    }
  });
}

function addDefaultSlashCommands(config: SerializedContinueConfig): void {
  const defaultSlashCommands = defaultSlashCommandsVscode; // or defaultSlashCommandsJetBrains based on IDE type
  defaultSlashCommands.forEach((defaultCommand) => {
    const commandExists = config.slashCommands?.some(
      (configCommand) => configCommand.name === defaultCommand.name,
    );

    if (!commandExists) {
      config.slashCommands = config.slashCommands || [];
      config.slashCommands.push({ ...defaultCommand });
    }
  });
}


async function loadFullConfigNode(
=======
async function buildConfigTsWithBinary() {
  const cmd = [
    escapeSpacesInPath(getEsbuildBinaryPath()),
    escapeSpacesInPath(getConfigTsPath()),
    "--bundle",
    `--outfile=${escapeSpacesInPath(getConfigJsPath())}`,
    "--platform=node",
    "--format=cjs",
    "--sourcemap",
    "--external:fetch",
    "--external:fs",
    "--external:path",
    "--external:os",
    "--external:child_process",
  ].join(" ");

  execSync(cmd);
}

async function buildConfigTsWithNodeModule() {
  const { build } = await import("esbuild");

  await build({
    entryPoints: [getConfigTsPath()],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: getConfigJsPath(),
    external: ["fetch", "fs", "path", "os", "child_process"],
    sourcemap: true,
  });
}

function readConfigJs(): string | undefined {
  const configJsPath = getConfigJsPath();

  if (!fs.existsSync(configJsPath)) {
    return undefined;
  }

  return fs.readFileSync(configJsPath, "utf8");
}

async function buildConfigTsandReadConfigJs(ide: IDE, ideType: IdeType) {
  const configTsPath = getConfigTsPath();

  if (!fs.existsSync(configTsPath)) {
    return;
  }

  const currentContent = fs.readFileSync(configTsPath, "utf8");

  // If the user hasn't modified the default config.ts, don't bother building
  if (currentContent.trim() === DEFAULT_CONFIG_TS_CONTENTS.trim()) {
    return;
  }

  await handleEsbuildInstallation(ide, ideType);
  await tryBuildConfigTs();

  return readConfigJs();
}

async function loadContinueConfigFromJson(
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  ide: IDE,
  workspaceConfigs: ContinueRcJson[],
  ideSettings: IdeSettings,
  ideType: IdeType,
  uniqueId: string,
  writeLog: (log: string) => Promise<void>,
  workOsAccessToken: string | undefined,
  overrideConfigJson: SerializedContinueConfig | undefined,
): Promise<ConfigResult<ContinueConfig>> {
  // Serialized config
  let {
    config: serialized,
    errors,
    configLoadInterrupted,
  } = loadSerializedConfig(
    workspaceConfigs,
    ideSettings,
    ideType,
    overrideConfigJson,
    ide,
  );

  if (!serialized || configLoadInterrupted) {
    return { errors, config: undefined, configLoadInterrupted: true };
  }

  const systemPromptDotFile = await getSystemPromptDotFile(ide);
  if (systemPromptDotFile) {
    serialized.systemMessage = systemPromptDotFile;
  }

  // Apply shared config
  // TODO: override several of these values with user/org shared config
  const sharedConfig = new GlobalContext().getSharedConfig();
  const withShared = modifyContinueConfigWithSharedConfig(
    serialized,
    sharedConfig,
  );

  // check and enforce default models
  await addDefaults(serialized);

  // Convert serialized to intermediate config
  let intermediate = await serializedToIntermediateConfig(withShared, ide);

  // Apply config.ts to modify intermediate config
  const configJsContents = await buildConfigTsandReadConfigJs(ide, ideType);
  if (configJsContents) {
    try {
      // Try config.ts first
      const configJsPath = getConfigJsPath();
      let module: any;

      try {
        module = await import(configJsPath);
      } catch (e) {
        console.log(e);
        console.log(
          "Could not load config.ts as absolute path, retrying as file url ...",
        );
        try {
          module = await import(localPathToUri(configJsPath));
        } catch (e) {
          throw new Error("Could not load config.ts as file url either", {
            cause: e,
          });
        }
      }

      if (typeof require !== "undefined") {
        delete require.cache[require.resolve(configJsPath)];
      }
      if (!module.modifyConfig) {
        throw new Error("config.ts does not export a modifyConfig function.");
      }
      intermediate = module.modifyConfig(intermediate);
    } catch (e) {
      console.log("Error loading config.ts: ", e);
    }
  }

  // Apply remote config.js to modify intermediate config
  if (ideSettings.remoteConfigServerUrl) {
    try {
      const configJsPathForRemote = getConfigJsPathForRemote(
        ideSettings.remoteConfigServerUrl,
      );
      const module = await import(configJsPathForRemote);
      if (typeof require !== "undefined") {
        delete require.cache[require.resolve(configJsPathForRemote)];
      }
      if (!module.modifyConfig) {
        throw new Error("config.ts does not export a modifyConfig function.");
      }
      intermediate = module.modifyConfig(intermediate);
    } catch (e) {
      console.log("Error loading remotely set config.js: ", e);
    }
  }

  // Convert to final config format
  const { config: finalConfig, errors: finalErrors } =
    await intermediateToFinalConfig(
      intermediate,
      ide,
      ideSettings,
      uniqueId,
      writeLog,
      workOsAccessToken,
    );
  return {
    config: finalConfig,
    errors: [...(errors ?? []), ...finalErrors],
    configLoadInterrupted: false,
  };
}

export {
  finalToBrowserConfig,
  intermediateToFinalConfig,
  loadContinueConfigFromJson,
  type BrowserSerializedContinueConfig,
};