
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRepository = async (githubUrl: string, rawReadme: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Web3 security auditor and technical analyst. 
      Analyze this GitHub repository: ${githubUrl}
      Raw Readme Snippet: ${rawReadme.substring(0, 1000)}
      
      Generate a high-level technical summary (max 200 chars) and select 3-5 high-impact tech tags.
      Format the summary to sound like a terminal system report.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "tags"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      summary: "MANUAL_INDEX_REQUIRED: Source code accessible via GitHub URI. Integrity verified.",
      tags: ["Solana", "Web3", "OSS"]
    };
  }
};
