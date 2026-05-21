import { KnowledgeIngestionService }
  from "../rag/knowledge-ingestion.service";

async function main() {

  await KnowledgeIngestionService
    .ingestTextFile("refund-policy.txt");

  await KnowledgeIngestionService
    .ingestTextFile("security-policy.txt");

  await KnowledgeIngestionService
    .ingestTextFile("sla-policy.txt");

  console.log(
    "Knowledge base ingestion complete"
  );
}

main();