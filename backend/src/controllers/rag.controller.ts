import { Request, Response }
  from "express";

import { RagResponseService }
  from "../rag/rag-response.service";

export class RagController {

  static async askQuestion(
    req: Request,
    res: Response
  ) {

    try {

      const query = req.body.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Missing query"
        });
      }

      const response =
        await RagResponseService
          .generateResponse(query);

      return res.json({
        success: true,
        response
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "RAG response generation failed"
      });
    }
  }
}