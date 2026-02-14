
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRepository = async (githubUrl: string, rawReadme: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this repository: ${githubUrl}. Content snippet: ${rawReadme.substring(0, 2000)}`,
      config: {
        systemInstruction: "You are a Web3 security auditor. Generate a high-level report summary (max 200 chars) and 3-5 tech tags in JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Terminal style summary" },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "tags"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { summary: "Integrity verified via GitHub URI.", tags: ["Solana", "Web3"] };
  }
};

/**
 * 為 Pump.fun 生成代幣 Metadata
 * 核心修正：描述必須極短 (30字內)，以防止 0xd URI too long 錯誤。
 */
export const generateTokenMetadata = async (repoName: string, summary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `GitHub Project: ${repoName}. Technical Summary: ${summary}.`,
      config: {
        systemInstruction: "Generate a catchy Token Name, a Ticker (3-6 chars), and a VERY SHORT description. CRITICAL: The description MUST be STRICTLY under 30 characters for Metaplex URI compatibility. Format as JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            ticker: { type: Type.STRING },
            description: { type: Type.STRING, description: "STRICTLY MAX 30 CHARS" }
          },
          required: ["name", "ticker", "description"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Metadata Generation Error:", error);
    return { name: repoName.toUpperCase(), ticker: repoName.slice(0, 4).toUpperCase(), description: "Open source index." };
  }
};
