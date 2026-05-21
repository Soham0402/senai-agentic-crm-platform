import { legalKeywords } from "./keyword-dictionaries";

export const detectLegalRisk = (
  content: string
) => {

  for (const keyword of legalKeywords) {

    if (content.includes(keyword)) {
      return true;
    }
  }

  return false;
};