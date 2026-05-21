import { ransomwareKeywords } from "./keyword-dictionaries";

export const detectRansomwareThreat = (
  content: string
) => {

  let matches = 0;

  for (const keyword of ransomwareKeywords) {

    if (content.includes(keyword)) {
      matches++;
    }
  }

  return matches >= 2;
};