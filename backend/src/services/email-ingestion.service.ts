import { prisma } from "../lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { addToProcessingQueue } from "../queue/email-processing.queue";
import { IngestEmailInput } from "../validators/email.validator";

export class EmailIngestionService {
  static async ingestEmail(payload: IngestEmailInput) {

    const existingEmail = await prisma.Email.findUnique({
      where: {
        messageId: payload.message_id
      }
    });

    if (existingEmail) {
      throw new Error("DUPLICATE_MESSAGE_ID");
    }

    let contact = await prisma.Contact.findUnique({
      where: {
        email: payload.from
      }
    });

    if (!contact) {
      contact = await prisma.Contact.create({
        data: {
          email: payload.from
        }
      });
    }

    let thread = await prisma.Thread.findUnique({
      where: {
        threadId: payload.thread_id
      }
    });

    if (!thread) {
      thread = await prisma.Thread.create({
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

    const email = await prisma.Email.create({
      data: {
        messageId: payload.message_id,
        sender: payload.from,
        subject: payload.subject,
        body: payload.body,
        timestamp: new Date(payload.timestamp),
        threadId: thread.id,
        status: "RECEIVED"
      }
    });

    const ingestionJob = await prisma.IngestionJob.create({
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