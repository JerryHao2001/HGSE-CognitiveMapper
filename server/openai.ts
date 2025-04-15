import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateNodesByTopic(topic: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in cognitive mapping and analyzing complex topics. Given a topic or statement, identify 5-8 key components, concepts, or perspectives that would be helpful to include in a cognitive map. Respond with JSON containing an array of nodes, where each node has an id, position (x,y coordinates), and data (with label and description). Position the nodes in a radial pattern around the center of the canvas (x:400, y:300).",
        },
        {
          role: "user",
          content: `Generate nodes for a cognitive map on this topic: "${topic}". Respond with JSON in the format: { "nodes": [{ "id": "string", "type": "custom", "position": { "x": number, "y": number }, "data": { "label": "string", "description": "string" }}] }`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Error generating nodes:", error);
    throw new Error("Failed to generate nodes from topic");
  }
}

export async function getChatResponse(
  message: string,
  mapState?: { nodes: any[]; edges: any[] },
) {
  try {
    let systemContent =
      "You are a helpful assistant specializing in cognitive mapping, analysis of complex topics, and educational methodologies. Help the user understand concepts, brainstorm ideas for their cognitive maps, and provide thoughtful responses to their questions. Your answers should be concise but comprehensive.";

    if (mapState && (mapState.nodes.length > 0 || mapState.edges.length > 0)) {
      systemContent += "\n\nCurrent cognitive map state:\n";
      systemContent += `Nodes (${mapState.nodes.length}):${mapState.nodes.map((n) => `\n- ${n.data.label}: ${n.data.description || "No description"}`).join("")}`;
      systemContent += `\n\nConnections (${mapState.edges.length}):${mapState.edges.map((e) => `\n- ${e.label || "Relates to"}`).join("")}`;
    } else {
      systemContent += "\n\nThere is no existing cognitive map on the canvas.";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error("Failed to get response from AI assistant");
  }
}
