-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('ACTIVE', 'VIP', 'BLOCKED', 'CHURNED');

-- CreateEnum
CREATE TYPE "ThreadStatus" AS ENUM ('OPEN', 'RESOLVED', 'ESCALATED', 'IGNORED');

-- CreateEnum
CREATE TYPE "EmailCategory" AS ENUM ('COMPLAINT', 'INQUIRY', 'BUG_REPORT', 'FEATURE_REQUEST', 'COMPLIANCE', 'LEGAL', 'BILLING', 'SPAM', 'INTERNAL', 'OTHER');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'REPLIED', 'ESCALATED', 'IGNORED');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('AUTO_REPLY', 'ESCALATE', 'LEGAL_FLAG', 'TICKET_CREATED', 'IGNORED');

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "company" TEXT,
    "status" "ContactStatus" NOT NULL DEFAULT 'ACTIVE',
    "accountValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "churnRiskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastContactAt" TIMESTAMP(3),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "status" "ThreadStatus" NOT NULL DEFAULT 'OPEN',
    "assignedTo" TEXT,
    "firstSeenAt" TIMESTAMP(3) NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "category" "EmailCategory",
    "urgency" "UrgencyLevel",
    "sentimentScore" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "requiresHuman" BOOLEAN NOT NULL DEFAULT false,
    "rawEntities" JSONB,
    "status" "EmailStatus" NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "threadId" TEXT NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "proposedContent" TEXT,
    "reasoningLog" JSONB,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "executedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailId" TEXT NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "sourceDoc" TEXT NOT NULL,
    "chunkText" TEXT NOT NULL,
    "embedding" vector NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebIntelligenceCache" (
    "id" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "scrapedData" JSONB NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebIntelligenceCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "diff" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "reasoningTrace" JSONB NOT NULL,
    "toolCalls" JSONB NOT NULL,
    "finalDecision" TEXT NOT NULL,
    "dryRun" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentimentHistory" (
    "id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "SentimentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngestionJob" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "IngestionJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Thread_threadId_key" ON "Thread"("threadId");

-- CreateIndex
CREATE INDEX "Thread_threadId_idx" ON "Thread"("threadId");

-- CreateIndex
CREATE INDEX "Thread_senderEmail_idx" ON "Thread"("senderEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Email_messageId_key" ON "Email"("messageId");

-- CreateIndex
CREATE INDEX "Email_messageId_idx" ON "Email"("messageId");

-- CreateIndex
CREATE INDEX "Email_sender_idx" ON "Email"("sender");

-- CreateIndex
CREATE INDEX "Email_timestamp_idx" ON "Email"("timestamp");

-- CreateIndex
CREATE INDEX "Action_emailId_idx" ON "Action"("emailId");

-- CreateIndex
CREATE INDEX "WebIntelligenceCache_targetEntity_idx" ON "WebIntelligenceCache"("targetEntity");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AgentRun_emailId_idx" ON "AgentRun"("emailId");

-- CreateIndex
CREATE INDEX "SentimentHistory_sender_idx" ON "SentimentHistory"("sender");

-- CreateIndex
CREATE INDEX "SentimentHistory_recordedAt_idx" ON "SentimentHistory"("recordedAt");

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentimentHistory" ADD CONSTRAINT "SentimentHistory_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
