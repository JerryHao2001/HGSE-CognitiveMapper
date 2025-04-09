import { apiRequest } from './queryClient';
import { CustomNode, CustomEdge } from '../types';

export async function generateNodesFromTopic(topic: string): Promise<CustomNode[]> {
  const response = await apiRequest('POST', '/api/analyze-topic', { topic });
  const data = await response.json();
  return data.nodes;
}

export async function sendChatMessage(message: string): Promise<string> {
  const response = await apiRequest('POST', '/api/chat', { message });
  const data = await response.json();
  return data.response;
}

export async function saveMap(name: string, nodes: CustomNode[], edges: CustomEdge[]): Promise<{ id: string }> {
  const response = await apiRequest('POST', '/api/maps', { 
    name, 
    nodes, 
    edges, 
    createdAt: new Date().toISOString() 
  });
  return await response.json();
}
