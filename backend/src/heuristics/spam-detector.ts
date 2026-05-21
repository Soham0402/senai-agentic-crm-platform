import { spamKeywords } from "./keyword-dictionaries";

export const calculateSpamScore = (
  content: string
) => {

  let score = 0;

  for (const keyword of spamKeywords) {

    if (content.includes(keyword)) {
      score += 0.2;
    }
  }

  return Math.min(score, 1);
};