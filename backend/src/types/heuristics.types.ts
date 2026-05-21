export type HeuristicResult = {
  spamScore: number;

  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  detectedCategories: string[];

  requiresHuman: boolean;

  flags: string[];

  sentimentHint: number;
};