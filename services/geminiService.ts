
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const fetchLearningContent = async (topic: string): Promise<{ text: string, sources: any[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Explain the following cryptocurrency topic in a clear and concise way for a beginner: "${topic}"`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        return { text, sources };
    } catch (error) {
        console.error("Error fetching learning content from Gemini API:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
};
