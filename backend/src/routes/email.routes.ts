import { Router } from "express";

import { EmailController } from "../controllers/email.controller";

const router = Router();

router.post(
  "/ingest",
  EmailController.ingestEmail
);

router.get(
  "/status/:jobId",
  EmailController.getJobStatus
);

export default router;