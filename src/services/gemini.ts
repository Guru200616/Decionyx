import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const decisionModel = "gemini-3-flash-preview";

export async function generateDecision(query: string, context: string) {
  // Trust & Safety Layer: Guardrails
  const safetyCheck = await ai.models.generateContent({
    model: decisionModel,
    contents: `Analyze the following query for PII, malicious intent, or unethical business requests: "${query}". Respond with "SAFE" or "UNSAFE: [reason]".`
  });

  if (safetyCheck.text?.includes("UNSAFE")) {
    throw new Error(`Guardrail Violation: ${safetyCheck.text}`);
  }

  const response = await ai.models.generateContent({
    model: decisionModel,
    contents: `
      User Query: ${query}
      Context: ${context}
      
      Act as a Decision Intelligence Operating System. 
      Analyze the query and provide a structured decision output.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insight: { type: Type.STRING },
          reasoning: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          evidence: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          confidence: { type: Type.NUMBER },
          action: { type: Type.STRING },
          riskLevel: { 
            type: Type.STRING,
            enum: ["low", "medium", "high"]
          }
        },
        required: ["insight", "reasoning", "evidence", "confidence", "action", "riskLevel"]
      }
    }
  });

  return JSON.parse(response.text);
}
