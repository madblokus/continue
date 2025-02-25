import { BaseContextProvider } from "../";
import {
  ContextItem,
  ContextProviderDescription,
  ContextProviderExtras,
<<<<<<< HEAD
} from "../../index.js";
import { BaseContextProvider } from "../index.js";
import { retrieveContextItemsFromEmbeddings } from "../retrieval/retrieval.js";
import FileTreeContextProvider from "./FileTreeContextProvider";
=======
} from "../../";
import { retrieveContextItemsFromEmbeddings } from "../retrieval/retrieval";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

class CodebaseContextProvider extends BaseContextProvider {
  static description: ContextProviderDescription = {
    title: "codebase",
    displayTitle: "Codebase",
    description: "Automatically find relevant files",
    type: "normal",
    renderInlineAs: "",
  };

  async getContextItems(
    query: string,
    extras: ContextProviderExtras,
  ): Promise<ContextItem[]> {
   
    const embeddingsItems = await retrieveContextItemsFromEmbeddings(extras, this.options, undefined); 
    const fileTreeProvider = new FileTreeContextProvider(this.options);
    const directoryStructureItems = await fileTreeProvider.getContextItems(query, extras);

    return [...embeddingsItems, ...directoryStructureItems];
  }
  async load(): Promise<void> {}
}

export default CodebaseContextProvider;
