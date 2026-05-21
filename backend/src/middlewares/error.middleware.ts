import { Request, Response, NextFunction } from "express";

import { errorResponse } from "../utils/api-response";

export const globalErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {

  console.error(error);

  return res.status(500).json(
    errorResponse(
      "INTERNAL_SERVER_ERROR",
      "Something went wrong"
    )
  );
};