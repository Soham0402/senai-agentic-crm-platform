# Database Design Decisions

## Why PostgreSQL?
PostgreSQL provides strong relational consistency while also supporting JSON and vector extensions required for RAG retrieval.

## Why Separate Threads and Emails?
Threads represent conversations, while emails represent individual events within the conversation lifecycle.

## Why Audit Logs?
Critical for enterprise traceability, compliance workflows, and debugging autonomous agent actions.

## Why JSON Fields?
Entity extraction outputs vary dynamically, making JSON storage more flexible than rigid normalization.

## Why pgvector?
Allows semantic search directly inside PostgreSQL without requiring separate vector infrastructure.