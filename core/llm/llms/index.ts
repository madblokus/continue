import {
  BaseCompletionOptions,
  IdeSettings,
  ILLM,
  LLMOptions,
  ModelDescription,
<<<<<<< HEAD
  PearAuth,
} from "../../index.js";
import { DEFAULT_MAX_TOKENS } from "../constants.js";
import { BaseLLM } from "../index.js";
import Anthropic from "./Anthropic.js";
import Azure from "./Azure.js";
import Bedrock from "./Bedrock.js";
import Cloudflare from "./Cloudflare.js";
import Cohere from "./Cohere.js";
import DeepInfra from "./DeepInfra.js";
import Deepseek from "./Deepseek.js";
import Fireworks from "./Fireworks.js";
import Flowise from "./Flowise.js";
import FreeTrial from "./FreeTrial.js";
import Gemini from "./Gemini.js";
import Groq from "./Groq.js";
import HuggingFaceInferenceAPI from "./HuggingFaceInferenceAPI.js";
import HuggingFaceTGI from "./HuggingFaceTGI.js";
import LMStudio from "./LMStudio.js";
import LlamaCpp from "./LlamaCpp.js";
import Llamafile from "./Llamafile.js";
import Mistral from "./Mistral.js";
import Msty from "./Msty.js";
import Ollama from "./Ollama.js";
import OpenAI from "./OpenAI.js";
import OpenRouter from "./OpenRouter.js";
import Replicate from "./Replicate.js";
import TextGenWebUI from "./TextGenWebUI.js";
import Together from "./Together.js";
import WatsonX from "./WatsonX.js";
import ContinueProxy from "./stubs/ContinueProxy.js";
import PearAIServer from "./PearAIServer.js";

=======
} from "../..";
import { renderTemplatedString } from "../../promptFiles/v1/renderTemplatedString";
import { BaseLLM } from "../index";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

import Anthropic from "./Anthropic";
import Asksage from "./Asksage";
import Azure from "./Azure";
import Bedrock from "./Bedrock";
import BedrockImport from "./BedrockImport";
import Cerebras from "./Cerebras";
import Cloudflare from "./Cloudflare";
import Cohere from "./Cohere";
import DeepInfra from "./DeepInfra";
import Deepseek from "./Deepseek";
import Fireworks from "./Fireworks";
import Flowise from "./Flowise";
import FreeTrial from "./FreeTrial";
import FunctionNetwork from "./FunctionNetwork";
import Gemini from "./Gemini";
import Groq from "./Groq";
import HuggingFaceInferenceAPI from "./HuggingFaceInferenceAPI";
import HuggingFaceTGI from "./HuggingFaceTGI";
import Kindo from "./Kindo";
import LlamaCpp from "./LlamaCpp";
import Llamafile from "./Llamafile";
import LMStudio from "./LMStudio";
import Mistral from "./Mistral";
import MockLLM from "./Mock";
import Moonshot from "./Moonshot";
import Msty from "./Msty";
import Nebius from "./Nebius";
import Nvidia from "./Nvidia";
import Ollama from "./Ollama";
import OpenAI from "./OpenAI";
import OpenRouter from "./OpenRouter";
import Replicate from "./Replicate";
import SageMaker from "./SageMaker";
import SambaNova from "./SambaNova";
import Scaleway from "./Scaleway";
import SiliconFlow from "./SiliconFlow";
import ContinueProxy from "./stubs/ContinueProxy";
import TestLLM from "./Test";
import TextGenWebUI from "./TextGenWebUI";
import Together from "./Together";
import Novita from "./Novita";
import VertexAI from "./VertexAI";
import Vllm from "./Vllm";
import WatsonX from "./WatsonX";
import xAI from "./xAI";

export const LLMClasses = [
  Anthropic,
  Cohere,
  FreeTrial,
  FunctionNetwork,
  Gemini,
  Llamafile,
  Moonshot,
  Ollama,
  Replicate,
  TextGenWebUI,
  Together,
  Novita,
  HuggingFaceTGI,
  HuggingFaceInferenceAPI,
  Kindo,
  LlamaCpp,
  OpenAI,
  LMStudio,
  Mistral,
  Bedrock,
  BedrockImport,
  SageMaker,
  DeepInfra,
  Flowise,
  Groq,
  Fireworks,
  ContinueProxy,
  Cloudflare,
  Deepseek,
  Msty,
  Azure,
  WatsonX,
<<<<<<< HEAD
  PearAIServer,
  OpenRouter,
=======
  OpenRouter,
  Nvidia,
  Vllm,
  SambaNova,
  MockLLM,
  TestLLM,
  Cerebras,
  Asksage,
  Nebius,
  VertexAI,
  xAI,
  SiliconFlow,
  Scaleway,
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
];

export async function llmFromDescription(
  desc: ModelDescription,
  readFile: (filepath: string) => Promise<string>,
  uniqueId: string,
  ideSettings: IdeSettings,
  writeLog: (log: string) => Promise<void>,
  completionOptions?: BaseCompletionOptions,
  systemMessage?: string,
  getCurrentDirectory?: () => Promise<string>,
  getCredentials?: () => Promise<PearAuth | undefined>,
  setCredentials?: (auth: PearAuth) => Promise<void>,
): Promise<BaseLLM | undefined> {
  const cls = LLMClasses.find((llm) => llm.providerName === desc.provider);

  if (!cls) {
    return undefined;
  }

  const finalCompletionOptions = {
    ...completionOptions,
    ...desc.completionOptions,
  };

  systemMessage = desc.systemMessage ?? systemMessage;
  if (systemMessage !== undefined) {
    systemMessage = await renderTemplatedString(systemMessage, readFile, {});
  }

  let options: LLMOptions = {
    ...desc,
    completionOptions: {
      ...finalCompletionOptions,
      model: (desc.model || cls.defaultOptions?.model) ?? "codellama-7b",
      maxTokens:
        finalCompletionOptions.maxTokens ??
        cls.defaultOptions?.completionOptions?.maxTokens,
    },
    systemMessage,
    writeLog,
    uniqueId,
    getCurrentDirectory,
    getCredentials,
    setCredentials,
  };

  if (desc.provider === "continue-proxy") {
    options.apiKey = ideSettings.userToken;
    if (ideSettings.remoteConfigServerUrl) {
      options.apiBase = new URL(
        "/proxy/v1",
        ideSettings.remoteConfigServerUrl,
      ).toString();
    }
  }

  return new cls(options);
}

export function llmFromProviderAndOptions(
  providerName: string,
  llmOptions: LLMOptions,
): ILLM {
  const cls = LLMClasses.find((llm) => llm.providerName === providerName);

  if (!cls) {
    throw new Error(`Unknown LLM provider type "${providerName}"`);
  }

  return new cls(llmOptions);
}
