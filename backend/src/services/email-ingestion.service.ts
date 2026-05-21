import { prisma } from "../lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { addToProcessingQueue } from "../queue/email-processing.queue";
import { IngestEmailInput } from "../validators/email.validator";
import { runHeuristics } from "../heuristics/heuristic-engine";
import { AuditLogService } from "./audit-log.service";

export class EmailIngestionService {
  static async ingestEmail(payload: IngestEmailInput) {

    const existingEmail = await prisma.email.findUnique({
      where: {
        messageId: payload.message_id
      }
    });

    if (existingEmail) {
      throw new Error("DUPLICATE_MESSAGE_ID");
    }

    let contact = await prisma.contact.findUnique({
      where: {
        email: payload.from
      }
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          email: payload.from
        }
      });
    }

    let thread = await prisma.thread.findUnique({
      where: {
        threadId: payload.thread_id
      }
    });

    if (!thread) {
      thread = await prisma.thread.create({
        data: {
          threadId: payload.thread_id,
          subject: payload.subject,
          senderEmail: payload.from,
          firstSeenAt: new Date(payload.timestamp),
          lastUpdatedAt: new Date(payload.timestamp),
          contactId: contact.id
        }
      });
    }
    
    const heuristicResult = runHeuristics(
      payload.subject,
      payload.body
    );

    const email = await prisma.email.create({
      data: {
        messageId: payload.message_id,
        sender: payload.from,
        subject: payload.subject,
        body: payload.body,
        timestamp: new Date(payload.timestamp),

        threadId: thread.id,

        urgency: heuristicResult.urgency,

        sentimentScore:
          heuristicResult.sentimentHint,

        requiresHuman:
          heuristicResult.requiresHuman,

        category:
          heuristicResult.detectedCategories[0] as any,

        rawEntities: {
          heuristicFlags:
            heuristicResult.flags
        },

        status: "RECEIVED"
      }
    });

    await AuditLogService.logAction(
      "EMAIL",
      email.id,
      "EMAIL_INGESTED",
      "agent",
      {
        urgency: heuristicResult.urgency,
        flags: heuristicResult.flags
      }
    );

    const ingestionJob = await prisma.ingestionJob.create({
      data: {
        messageId: payload.message_id,
        status: "QUEUED"
      }
    });

    addToProcessingQueue({
      emailId: email.id,
      messageId: email.messageId
    });

    return {
      emailId: email.id,
      ingestionJobId: ingestionJob.id
    };
  }
}