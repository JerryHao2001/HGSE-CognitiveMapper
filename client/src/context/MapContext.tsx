import { createContext, useContext, useState, ReactNode } from "react";
import {
  Connection,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
  addEdge,
  MarkerType,
} from "reactflow";
import { CustomNode, CustomEdge, MapState } from "../types";
import { v4 as uuidv4 } from "uuid";

interface MapContextType {
  nodes: CustomNode[];
  edges: CustomEdge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: (connection: Connection) => void;
  addNode: (x: number, y: number, label?: string, description?: string) => void;
  updateNode: (
    id: string,
    data: { label?: string; description?: string },
  ) => void;
  updateEdge: (
    id: string,
    data: { label?: string; description?: string },
  ) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  clearCanvas: () => void;
  setInitialNodes: (nodes: CustomNode[]) => void;
  getMapState: () => MapState;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode["data"]>(
    [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);

  const onConnect = (connection: Connection) => {
    const newEdge = {
      ...connection,
      id: uuidv4(),
      type: "custom",
      label: "Enter Link Relationship",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#A31F36",
      },
      style: {
        stroke: "#A31F36",
        strokeWidth: 2,
      },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  };

  const addNode = (
    x: number,
    y: number,
    label = "New Node",
    description = "Double-click to edit",
  ) => {
    const newNode: CustomNode = {
      id: uuidv4(),
      type: "custom",
      position: { x, y },
      data: { label, description },
    };
    setNodes((nds) => [...nds, newNode]);
    return newNode;
  };

  const updateNode = (
    id: string,
    data: { label?: string; description?: string },
  ) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      }),
    );
  };

  const updateEdge = (
    id: string,
    data: { label?: string; description?: string },
  ) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            label: data.label || edge.label,
            description: data.description,
          };
        }
        return edge;
      }),
    );
  };

  const deleteNode = (id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    // Delete connected edges
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id),
    );
  };

  const deleteEdge = (id: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== id));
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  const setInitialNodes = (newNodes: CustomNode[]) => {
    clearCanvas();
    setNodes(newNodes);
  };

  const getMapState = (): MapState => {
    return {
      nodes,
      edges,
    };
  };

  return (
    <MapContext.Provider
      value={{
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        updateNode,
        updateEdge,
        deleteNode,
        deleteEdge,
        clearCanvas,
        setInitialNodes,
        getMapState,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
