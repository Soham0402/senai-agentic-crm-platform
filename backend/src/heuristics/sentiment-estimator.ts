const negativeWords = [
  "angry",
  "terrible",
  "frustrated",
  "refund",
  "cancel",
  "lawsuit",
  "outage",
  "broken"
];

const positiveWords = [
  "great",
  "love",
  "thanks",
  "excellent",
  "happy"
];

export const estimateSentiment = (
  content: string
) => {

  let score = 0;

  for (const word of positiveWords) {
    if (content.includes(word)) {
      score += 0.2;
    }
  }

  for (const word of negativeWords) {
    if (content.includes(word)) {
      score -= 0.2;
    }
  }

  return Math.max(-1, Math.min(score, 1));
};