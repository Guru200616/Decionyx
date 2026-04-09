import { GoogleGenAI, Type } from "@google/genai";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = Netlify.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "GEMINI_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { query, context } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Missing required field: query" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const decisionModel = "gemini-2.0-flash";

    // Trust & Safety Layer: Guardrails
    const safetyCheck = await ai.models.generateContent({
      model: decisionModel,
      contents: `Analyze the following query for PII, malicious intent, or unethical business requests: "${query}". Respond with "SAFE" or "UNSAFE: [reason]".`,
    });

    if (safetyCheck.text?.includes("UNSAFE")) {
      return new Response(
        JSON.stringify({ error: `Guardrail Violation: ${safetyCheck.text}` }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await ai.models.generateContent({
      model: decisionModel,
      contents: `
        User Query: ${query}
        Context: ${context || "General business context"}

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
              items: { type: Type.STRING },
            },
            evidence: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            confidence: { type: Type.NUMBER },
            action: { type: Type.STRING },
            riskLevel: {
              type: Type.STRING,
              enum: ["low", "medium", "high"],
            },
          },
          required: [
            "insight",
            "reasoning",
            "evidence",
            "confidence",
            "action",
            "riskLevel",
          ],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Decision function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = {
  path: "/api/decide",
  method: "POST",
};
