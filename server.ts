import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Decision API endpoint (Mirroring Netlify function for local dev)
  app.post("/api/decide", async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    try {
      const { query, context } = req.body;

      if (!query) {
        return res.status(400).json({ error: "Missing required field: query" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const decisionModel = "gemini-2.0-flash";

      // Trust & Safety Layer: Guardrails
      const safetyCheck = await ai.models.generateContent({
        model: decisionModel,
        contents: `Analyze the following query for PII, malicious intent, or unethical business requests: "${query}". Respond with "SAFE" or "UNSAFE: [reason]".`,
      });

      if (safetyCheck.text?.includes("UNSAFE")) {
        return res.status(422).json({ error: `Guardrail Violation: ${safetyCheck.text}` });
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
      res.json(result);
    } catch (error: any) {
      console.error("Decision API error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Decionyx] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
