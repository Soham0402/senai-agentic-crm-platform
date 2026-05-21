import { urgencyKeywords } from "./keyword-dictionaries";

export const detectUrgency = (
  content: string
): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" => {

  for (const keyword of urgencyKeywords) {

    if (content.includes(keyword)) {

      if (
        keyword === "critical" ||
        keyword === "p0"
      ) {
        return "CRITICAL";
      }

      return "HIGH";
    }
  }

  return "MEDIUM";
};