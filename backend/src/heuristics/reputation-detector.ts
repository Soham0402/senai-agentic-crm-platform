import { reviewThreatKeywords } from "./keyword-dictionaries";

export const detectReputationThreat = (
  content: string
) => {

  for (const keyword of reviewThreatKeywords) {

    if (content.includes(keyword)) {
      return true;
    }
  }

  return false;
};