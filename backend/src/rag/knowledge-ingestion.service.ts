import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";
import { chunkText } from "./text-chunker";
import { EmbeddingService } from "./embedding.service";

export class KnowledgeIngestionService {
  static async ingestTextFile(fileName: string) {
    // Navigates out of src/rag and up to the root level above backend
    const filePath = path.join(__dirname, "..", "..", "..", "knowledge-base", fileName);
    
    const text = fs.readFileSync(filePath, "utf-8");
    const chunks = chunkText(text);

    for (const chunk of chunks) {
      const embedding = await EmbeddingService.generateEmbedding(chunk);

      await prisma.$executeRaw`
        INSERT INTO "KnowledgeChunk" (
          id, "sourceDoc", "chunkText", embedding, "createdAt"
        ) VALUES (
          gen_random_uuid(), ${fileName}, ${chunk}, ${embedding}::vector, NOW()
        )
      `;
    }

    return { fileName, chunksInserted: chunks.length };
  }
}
