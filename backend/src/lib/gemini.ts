import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing GEMINI_API_KEY"
  );
}

const genAI =
  new GoogleGenerativeAI(apiKey);

export const geminiModel =
  genAI.getGenerativeModel({
    model:
      process.env.GEMINI_MODEL ||
      "gemini-1.5-flash"
  });