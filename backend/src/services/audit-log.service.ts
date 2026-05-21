import { prisma } from "../lib/prisma";

export class AuditLogService {

  static async logAction(
    entityType: string,
    entityId: string,
    action: string,
    performedBy: string,
    diff?: unknown
  ) {

    await prisma.auditLog.create({
      data: {
        entityType,
        entityId,
        action,
        performedBy,
        diff: diff as any
      }
    });
  }
}