import { BranchAndDir, Chunk, IndexTag, IndexingProgressUpdate } from "../";
<<<<<<< HEAD
import { getBasename } from "../util/index";
import { RETRIEVAL_PARAMS } from "../util/parameters";
=======
import { RETRIEVAL_PARAMS } from "../util/parameters";
import { getUriPathBasename } from "../util/uri";

>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
import { ChunkCodebaseIndex } from "./chunk/ChunkCodebaseIndex";
import { DatabaseConnection, SqliteDb, tagToString } from "./refreshIndex";
import {
  IndexResultType,
  MarkCompleteCallback,
  RefreshIndexResults,
  type CodebaseIndex,
} from "./types";

<<<<<<< HEAD
=======
export interface RetrieveConfig {
  tags: BranchAndDir[];
  text: string;
  n: number;
  directory?: string;
  filterPaths?: string[];
  bm25Threshold?: number;
}

>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
export class FullTextSearchCodebaseIndex implements CodebaseIndex {
  relativeExpectedTime: number = 0.2;
  static artifactId = "sqliteFts";
  artifactId: string = FullTextSearchCodebaseIndex.artifactId;
<<<<<<< HEAD
=======
  pathWeightMultiplier = 10.0;
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

  private async _createTables(db: DatabaseConnection) {
    await db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS fts USING fts5(
        path,
        content,
        tokenize = 'trigram'
    )`);

    await db.exec(`CREATE TABLE IF NOT EXISTS fts_metadata (
        id INTEGER PRIMARY KEY,
        path TEXT NOT NULL,
        cacheKey TEXT NOT NULL,
        chunkId INTEGER NOT NULL,
        FOREIGN KEY (chunkId) REFERENCES chunks (id),
        FOREIGN KEY (id) REFERENCES fts (rowid)
    )`);
  }

  async *update(
    tag: IndexTag,
    results: RefreshIndexResults,
    markComplete: MarkCompleteCallback,
    repoName: string | undefined,
  ): AsyncGenerator<IndexingProgressUpdate, any, unknown> {
    const db = await SqliteDb.get();
    await this._createTables(db);

    for (let i = 0; i < results.compute.length; i++) {
      const item = results.compute[i];

      // Insert chunks
      const chunks = await db.all(
        "SELECT * FROM chunks WHERE path = ? AND cacheKey = ?",
        [item.path, item.cacheKey],
      );

      for (const chunk of chunks) {
        const { lastID } = await db.run(
          "INSERT INTO fts (path, content) VALUES (?, ?)",
          [item.path, chunk.content],
        );
        await db.run(
          `INSERT INTO fts_metadata (id, path, cacheKey, chunkId) 
           VALUES (?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
           path = excluded.path,
           cacheKey = excluded.cacheKey,
           chunkId = excluded.chunkId`,
          [lastID, item.path, item.cacheKey, chunk.id],
        );
      }

      yield {
        progress: i / results.compute.length,
<<<<<<< HEAD
        desc: `Indexing ${getBasename(item.path)}`,
        status: "indexing",
      };
      markComplete([item], IndexResultType.Compute);
=======
        desc: `Indexing ${getUriPathBasename(item.path)}`,
        status: "indexing",
      };
      await markComplete([item], IndexResultType.Compute);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    }

    // Add tag
    for (const item of results.addTag) {
<<<<<<< HEAD
      markComplete([item], IndexResultType.AddTag);
=======
      await markComplete([item], IndexResultType.AddTag);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    }

    // Remove tag
    for (const item of results.removeTag) {
<<<<<<< HEAD
      markComplete([item], IndexResultType.RemoveTag);
=======
      await markComplete([item], IndexResultType.RemoveTag);
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
    }

    // Delete
    for (const item of results.del) {
      await db.run("DELETE FROM fts_metadata WHERE path = ? AND cacheKey = ?", [
        item.path,
        item.cacheKey,
      ]);

      await db.run("DELETE FROM fts WHERE path = ?", [item.path]);

<<<<<<< HEAD
      markComplete([item], IndexResultType.Delete);
    }
  }

  async retrieve(
    tags: BranchAndDir[],
    text: string,
    n: number,
    directory: string | undefined,
    filterPaths: string[] | undefined,
    bm25Threshold: number = RETRIEVAL_PARAMS.bm25Threshold,
  ): Promise<Chunk[]> {
    const db = await SqliteDb.get();

    // Notice that the "chunks" artifactId is used because of linking between tables
    const tagStrings = tags.map((tag) => {
      return tagToString({ ...tag, artifactId: ChunkCodebaseIndex.artifactId });
    });

    const query = `SELECT fts_metadata.chunkId, fts_metadata.path, fts.content, rank
    FROM fts
    JOIN fts_metadata ON fts.rowid = fts_metadata.id
    JOIN chunk_tags ON fts_metadata.chunkId = chunk_tags.chunkId
    WHERE fts MATCH '${text.replace(
      /\?/g,
      "",
    )}' AND chunk_tags.tag IN (${tagStrings.map(() => "?").join(",")})
      ${
        filterPaths
          ? `AND fts_metadata.path IN (${filterPaths.map(() => "?").join(",")})`
          : ""
      }
    ORDER BY rank
    LIMIT ?`;

    let results = await db.all(query, [
      ...tagStrings,
      ...(filterPaths || []),
      Math.ceil(n),
    ]);

    results = results.filter((result) => result.rank <= bm25Threshold);
=======
      await markComplete([item], IndexResultType.Delete);
    }
  }

  async retrieve(config: RetrieveConfig): Promise<Chunk[]> {
    const db = await SqliteDb.get();

    const query = this.buildRetrieveQuery(config);
    const parameters = this.getRetrieveQueryParameters(config);

    let results = await db.all(query, parameters);

    results = results.filter(
      (result) =>
        result.rank <= (config.bm25Threshold ?? RETRIEVAL_PARAMS.bm25Threshold),
    );
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d

    const chunks = await db.all(
      `SELECT * FROM chunks WHERE id IN (${results.map(() => "?").join(",")})`,
      results.map((result) => result.chunkId),
    );

<<<<<<< HEAD
    return chunks.map((chunk) => {
      return {
        filepath: chunk.path,
        index: chunk.index,
        startLine: chunk.startLine,
        endLine: chunk.endLine,
        content: chunk.content,
        digest: chunk.cacheKey,
      };
    });
=======
    return chunks.map((chunk) => ({
      filepath: chunk.path,
      index: chunk.index,
      startLine: chunk.startLine,
      endLine: chunk.endLine,
      content: chunk.content,
      digest: chunk.cacheKey,
    }));
  }

  private buildTagFilter(tags: BranchAndDir[]): string {
    const tagStrings = this.convertTags(tags);

    return `AND chunk_tags.tag IN (${tagStrings.map(() => "?").join(",")})`;
  }

  private buildPathFilter(filterPaths: string[] | undefined): string {
    if (!filterPaths || filterPaths.length === 0) {
      return "";
    }
    return `AND fts_metadata.path IN (${filterPaths.map(() => "?").join(",")})`;
  }

  private buildRetrieveQuery(config: RetrieveConfig): string {
    return `
      SELECT fts_metadata.chunkId, fts_metadata.path, fts.content, rank
      FROM fts
      JOIN fts_metadata ON fts.rowid = fts_metadata.id
      JOIN chunk_tags ON fts_metadata.chunkId = chunk_tags.chunkId
      WHERE fts MATCH ?
      ${this.buildTagFilter(config.tags)}
      ${this.buildPathFilter(config.filterPaths)}
      ORDER BY bm25(fts, ${this.pathWeightMultiplier})
      LIMIT ?
    `;
  }

  private getRetrieveQueryParameters(config: RetrieveConfig) {
    const { text, tags, filterPaths, n } = config;
    const tagStrings = this.convertTags(tags);

    return [
      text.replace(/\?/g, ""),
      ...tagStrings,
      ...(filterPaths || []),
      Math.ceil(n),
    ];
  }

  private convertTags(tags: BranchAndDir[]): string[] {
    // Notice that the "chunks" artifactId is used because of linking between tables
    return tags.map((tag) =>
      tagToString({ ...tag, artifactId: ChunkCodebaseIndex.artifactId }),
    );
>>>>>>> 1ce064830391b3837099fe696ff3c1438bd4872d
  }
}
