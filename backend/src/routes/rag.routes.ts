import { Router } from "express";

import { RagController }
  from "../controllers/rag.controller";

const router = Router();

router.post(
  "/ask",
  RagController.askQuestion
);

export default router;