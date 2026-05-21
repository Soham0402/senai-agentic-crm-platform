import { prisma } from "../lib/prisma";

import { EmbeddingService }
  from "./embedding.service";

export class RetrievalService {

  static async retrieveRelevantChunks(
    query: string
  ) {

    const embedding =
      await EmbeddingService
        .generateEmbedding(query);

    const results =
      await prisma.$queryRawUnsafe(`
        SELECT
          id,
          "sourceDoc",
          "chunkText"
        FROM "KnowledgeChunk"
        ORDER BY embedding <-> '[${embedding.join(",")}]'
        LIMIT 5
      `);

    return results;
  }
}