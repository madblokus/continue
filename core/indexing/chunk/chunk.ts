import { Chunk, ChunkWithoutID } from "../../index.js";
import { countTokensAsync } from "../../llm/countTokens.js";
<<<<<<< HEAD
=======
import { extractMinimalStackTraceInfo } from "../../util/extractMinimalStackTraceInfo.js";
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import { Telemetry } from "../../util/posthog.js";
import { supportedLanguages } from "../../util/treeSitter.js";
import { getUriFileExtension, getUriPathBasename } from "../../util/uri.js";

import { basicChunker } from "./basic.js";
import { codeChunker } from "./code.js";

export type ChunkDocumentParam = {
  filepath: string;
  contents: string;
  maxChunkSize: number;
  digest: string;
};

async function* chunkDocumentWithoutId(
  fileUri: string,
  contents: string,
  maxChunkSize: number,
): AsyncGenerator<ChunkWithoutID> {
  if (contents.trim() === "") {
    return;
  }
  const extension = getUriFileExtension(fileUri);
  if (extension in supportedLanguages) {
    try {
      for await (const chunk of codeChunker(fileUri, contents, maxChunkSize)) {
        yield chunk;
      }
      return;
    } catch (e: any) {
<<<<<<< HEAD
      Telemetry.capture("code_chunker_error", {
        fileExtension: ext,
        // stack: extractMinimalStackTraceInfo(e.stack),
=======
      void Telemetry.capture("code_chunker_error", {
        fileExtension: extension,
        stack: extractMinimalStackTraceInfo(e.stack),
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
      });
      // falls back to basicChunker
    }
  }

  yield* basicChunker(contents, maxChunkSize);
}

export async function* chunkDocument({
  filepath,
  contents,
  maxChunkSize,
  digest,
}: ChunkDocumentParam): AsyncGenerator<Chunk> {
  let index = 0;
  const chunkPromises: Promise<Chunk | undefined>[] = [];
  for await (const chunkWithoutId of chunkDocumentWithoutId(
    filepath,
    contents,
    maxChunkSize,
  )) {
    chunkPromises.push(
      new Promise(async (resolve) => {
        if ((await countTokensAsync(chunkWithoutId.content)) > maxChunkSize) {
          // console.debug(
          //   `Chunk with more than ${maxChunkSize} tokens constructed: `,
          //   filepath,
          //   countTokens(chunkWithoutId.content),
          // );
          return resolve(undefined);
        }
        resolve({
          ...chunkWithoutId,
          digest,
          index,
          filepath,
        });
      }),
    );
    index++;
  }
  for await (const chunk of chunkPromises) {
    if (!chunk) {
      continue;
    }
    yield chunk;
  }
}

<<<<<<< HEAD
export function shouldChunk(
  pathSep: string,
  filepath: string,
  contents: string,
): boolean {
=======
export function shouldChunk(fileUri: string, contents: string): boolean {
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  if (contents.length > 1000000) {
    // if a file has more than 1m characters then skip it
    return false;
  }
  if (contents.length === 0) {
    return false;
  }
<<<<<<< HEAD
  const basename = filepath.split(pathSep).pop();
  // files without extensions are often binary files, skip it if so
  return basename?.includes(".") ?? false;
=======
  const baseName = getUriPathBasename(fileUri);
  return baseName.includes(".");
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
}
