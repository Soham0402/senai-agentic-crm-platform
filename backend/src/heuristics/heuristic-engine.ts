import { normalizeText } from "../utils/text-normalizer";

import { calculateSpamScore } from "./spam-detector";

import { detectUrgency } from "./urgency-detector";

import { detectLegalRisk } from "./legal-detector";

import { detectRansomwareThreat } from "./ransomware-detector";

import { detectReputationThreat } from "./reputation-detector";

import { detectSecurityThreat } from "./security-detector";

import { estimateSentiment } from "./sentiment-estimator";

import { HeuristicResult } from "../types/heuristics.types";

export const runHeuristics = (
  subject: string,
  body: string
): HeuristicResult => {

  const content = normalizeText(
    `${subject} ${body}`
  );

  const spamScore =
    calculateSpamScore(content);

  const urgency =
    detectUrgency(content);

  const legalThreat =
    detectLegalRisk(content);

  const ransomwareThreat =
    detectRansomwareThreat(content);

  const reputationThreat =
    detectReputationThreat(content);

  const securityThreat =
    detectSecurityThreat(content);

  const sentimentHint =
    estimateSentiment(content);

  const flags: string[] = [];

  const detectedCategories: string[] = [];

  if (legalThreat) {
    flags.push("LEGAL_RISK");
    detectedCategories.push("LEGAL");
  }

  if (ransomwareThreat) {
    flags.push("RANSOMWARE_THREAT");
    detectedCategories.push("SECURITY");
  }

  if (reputationThreat) {
    flags.push("REPUTATION_RISK");
  }

  if (securityThreat) {
    flags.push("SECURITY_RISK");
    detectedCategories.push("SECURITY");
  }

  if (spamScore >= 0.6) {
    detectedCategories.push("SPAM");
  }

  const requiresHuman =
    legalThreat ||
    ransomwareThreat ||
    urgency === "CRITICAL";

  return {
    spamScore,
    urgency,
    detectedCategories,
    requiresHuman,
    flags,
    sentimentHint
  };
};