import { Node as ReactFlowNode, Edge as ReactFlowEdge } from 'reactflow';

export type CustomNodeData = {
  label: string;
  description?: string;
};

export type CustomNode = ReactFlowNode<CustomNodeData>;

export type CustomEdgeData = {
  description?: string;
};

export type CustomEdge = ReactFlowEdge & CustomEdgeData;

export interface MapState {
  nodes: CustomNode[];
  edges: CustomEdge[];
}

export interface NodeResponse {
  nodes: CustomNode[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}
