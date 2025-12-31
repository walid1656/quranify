
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askQuranifyAI = async (query: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: ${context}\n\nUser Question: ${query}`,
      config: {
        systemInstruction: `You are 'Nur', an expert AI Quran Tutor on the Quranify platform. 
        Your role is to help students with:
        1. Explaining Tajweed rules with clear examples.
        2. Providing meanings of verses (Tafsir).
        3. Motivating students to continue their memorization journey.
        4. Answering questions about Quranic history.
        Always answer in a gentle, encouraging, and professional Arabic. 
        Use the 'Amiri' font style for Quranic verses if possible (e.g. by using Markdown symbols).`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، واجهت مشكلة في الاتصال بذاكرتي العلمية. حاول مرة أخرى لاحقاً.";
  }
};
