import { Request, Response } from "express";

import { ingestEmailSchema } from "../validators/email.validator";

import { EmailIngestionService } from "../services/email-ingestion.service";

import { successResponse, errorResponse } from "../utils/api-response";

import { prisma } from "../lib/prisma";

export class EmailController {

  static ingestEmail = async (
    req: Request,
    res: Response
  ) => {

    const validationResult =
      ingestEmailSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json(
        errorResponse(
          "INVALID_PAYLOAD",
          "Email payload validation failed",
          validationResult.error.flatten()
        )
      );
    }

    try {

      const result =
        await EmailIngestionService.ingestEmail(
          validationResult.data
        );

      return res.status(201).json(
        successResponse(
          result,
          "Email ingested successfully"
        )
      );

    } catch (error) {

      if (
        error instanceof Error &&
        error.message === "DUPLICATE_MESSAGE_ID"
      ) {
        return res.status(409).json(
          errorResponse(
            "DUPLICATE_MESSAGE_ID",
            "Duplicate message detected"
          )
        );
      }

      return res.status(500).json(
        errorResponse(
          "INGESTION_FAILED",
          "Failed to ingest email"
        )
      );
    }
  };

  static getJobStatus = async (
    req: Request,
    res: Response
  ) => {

    const job = await prisma.IngestionJob.findUnique({
      where: {
        id: req.params.jobId
      }
    });

    if (!job) {
      return res.status(404).json(
        errorResponse(
          "JOB_NOT_FOUND",
          "Ingestion job not found"
        )
      );
    }

    return res.status(200).json(
      successResponse(job)
    );
  };
}