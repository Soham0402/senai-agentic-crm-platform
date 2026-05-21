import { z } from "zod";

export const ingestEmailSchema = z.object({
  message_id: z.string().min(3),
  thread_id: z.string().min(3),

  from: z.string().email(),

  subject: z.string().min(1),

  body: z.string().min(1),

  timestamp: z.string(),

  metadata: z.object({
    source: z.string().optional(),
    priority: z.string().optional()
  }).optional()
});

export type IngestEmailInput = z.infer<typeof ingestEmailSchema>;