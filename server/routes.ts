import type { Express } from "express";
import { createServer, type Server } from "http";
import { chatRequestSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

const LYZER_API_URL = process.env.LYZER_API_URL || "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const LYZER_API_KEY = process.env.LYZER_API_KEY;
const LYZER_USER_ID = process.env.LYZER_USER_ID;
const LYZER_AGENT_ID = process.env.LYZER_AGENT_ID;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      if (!LYZER_API_KEY || !LYZER_USER_ID || !LYZER_AGENT_ID) {
        console.error("Missing Lyzer API configuration");
        return res.status(500).json({ 
          error: "AI service is not configured. Please contact support." 
        });
      }

      const parseResult = chatRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const validationError = fromZodError(parseResult.error);
        return res.status(400).json({ 
          error: validationError.message 
        });
      }

      const { message, sessionId } = parseResult.data;
      const lyzerSessionId = sessionId 
        ? `${LYZER_AGENT_ID}-${sessionId}` 
        : `${LYZER_AGENT_ID}-${Date.now()}`;

      const response = await fetch(LYZER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": LYZER_API_KEY,
        },
        body: JSON.stringify({
          user_id: LYZER_USER_ID,
          agent_id: LYZER_AGENT_ID,
          session_id: lyzerSessionId,
          message: message,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Lyzer API error:", response.status, errorText);
        return res.status(response.status).json({ 
          error: "Failed to generate response from AI agent" 
        });
      }

      const data = await response.json();
      
      const aiResponse = data.response || 
                         data.message || 
                         data.output || 
                         data.result ||
                         (typeof data === "string" ? data : JSON.stringify(data));

      return res.json({
        response: aiResponse,
        sessionId: lyzerSessionId,
      });
    } catch (error) {
      console.error("Chat API error:", error);
      return res.status(500).json({ 
        error: "An unexpected error occurred. Please try again." 
      });
    }
  });

  return httpServer;
}
