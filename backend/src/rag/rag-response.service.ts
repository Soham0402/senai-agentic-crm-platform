import { geminiModel }
  from "../lib/gemini";

import { RetrievalService }
  from "./retrieval.service";

export class RagResponseService {

  static async generateResponse(
    query: string
  ) {

    const retrievedChunks =
      await RetrievalService
        .retrieveRelevantChunks(query);

    const context =
      JSON.stringify(retrievedChunks);

    const prompt = `
You are an enterprise CRM AI assistant.

Answer ONLY using the provided context.

Context:
${context}

User Query:
${query}
`;

    const result =
      await geminiModel.generateContent(
        prompt
      );

    const response =
      await result.response;

    return response.text();
  }
}