import crypto from "crypto";

export class EmbeddingService {

  static async generateEmbedding(
    text: string
  ) {

    /**
     * TEMP MOCK EMBEDDING
     *
     * Later replace with:
     * Gemini embedding endpoint
     */

    const hash = crypto
      .createHash("sha256")
      .update(text)
      .digest("hex");

    return Array.from(hash)
      .slice(0, 128)
      .map(char => char.charCodeAt(0) / 255);
  }
}