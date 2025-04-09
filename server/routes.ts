import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { generateNodesByTopic, getChatResponse } from "./openai";
import { topicAnalysisSchema, chatMessageSchema, insertMapSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Topic analysis endpoint - generates nodes for a cognitive map
  app.post("/api/analyze-topic", async (req, res) => {
    try {
      const { topic } = topicAnalysisSchema.parse(req.body);
      const result = await generateNodesByTopic(topic);
      res.json(result);
    } catch (error) {
      console.error("Error in /api/analyze-topic:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze topic" 
      });
    }
  });

  // Chat message endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = chatMessageSchema.parse(req.body);
      const response = await getChatResponse(message);
      res.json({ response });
    } catch (error) {
      console.error("Error in /api/chat:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to process chat message" 
      });
    }
  });

  // Save map endpoint
  app.post("/api/maps", async (req, res) => {
    try {
      const mapData = insertMapSchema.parse(req.body);
      const savedMap = await storage.createMap(mapData);
      res.json({ id: savedMap.id });
    } catch (error) {
      console.error("Error in /api/maps:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to save map" 
      });
    }
  });

  // Get map by ID
  app.get("/api/maps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid map ID" });
      }
      
      const map = await storage.getMap(id);
      if (!map) {
        return res.status(404).json({ message: "Map not found" });
      }
      
      res.json(map);
    } catch (error) {
      console.error("Error in GET /api/maps/:id:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to retrieve map" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
