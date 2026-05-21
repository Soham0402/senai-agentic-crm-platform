import { securityKeywords } from "./keyword-dictionaries";

export const detectSecurityThreat = (
  content: string
) => {

  for (const keyword of securityKeywords) {

    if (content.includes(keyword)) {
      return true;
    }
  }

  return false;
};