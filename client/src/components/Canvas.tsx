import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  EdgeTypes,
  ConnectionMode,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '../components/ui/button';
import { 
  PlusSquare, 
  GitCommit, 
  Trash2, 
  XCircle, 
  ZoomIn, 
  ZoomOut, 
  Crosshair 
} from 'lucide-react';
import { useMap } from '../context/MapContext';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

function CanvasContent() {
  const reactFlowInstance = useReactFlow();
  const { toast } = useToast();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editNode, setEditNode] = useState<{id: string, label: string, description: string} | null>(null);
  const [editEdge, setEditEdge] = useState<{id: string, label: string, description: string} | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  
  const { 
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
  } = useMap();

  const handleAddNode = useCallback(() => {
    // Use screenToFlowPosition instead of the deprecated project method
    const position = reactFlowInstance.screenToFlowPosition({ 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2 
    });
    addNode(position.x, position.y);
    toast({
      title: 'Node added',
      description: 'Double-click the node to edit it'
    });
  }, [reactFlowInstance, addNode, toast]);

  const handleToggleAddLink = useCallback(() => {
    setIsAddingLink(!isAddingLink);
    if (!isAddingLink) {
      toast({
        title: 'Link mode activated',
        description: 'Click on a source node, then a target node to create a link'
      });
    } else {
      toast({
        title: 'Link mode deactivated',
      });
    }
  }, [isAddingLink, toast]);

  const handleNodeDoubleClick = useCallback((event: React.MouseEvent, node: any) => {
    setEditNode({
      id: node.id,
      label: node.data.label || '',
      description: node.data.description || '',
    });
  }, []);

  const handleEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: any) => {
    setEditEdge({
      id: edge.id,
      label: edge.label || 'Relates to',
      description: '', // Keeping this property but we won't use it in the UI
    });
  }, []);

  const handleUpdateNode = useCallback(() => {
    if (editNode) {
      updateNode(editNode.id, { 
        label: editNode.label, 
        description: editNode.description 
      });
      setEditNode(null);
      toast({
        title: 'Node updated',
      });
    }
  }, [editNode, updateNode, toast]);

  const handleUpdateEdge = useCallback(() => {
    if (editEdge) {
      updateEdge(editEdge.id, { 
        label: editEdge.label, 
        description: editEdge.description 
      });
      setEditEdge(null);
      toast({
        title: 'Link updated',
      });
    }
  }, [editEdge, updateEdge, toast]);

  const handleDeleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    selectedNodes.forEach(node => deleteNode(node.id));
    selectedEdges.forEach(edge => deleteEdge(edge.id));
    
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      toast({
        title: 'Deleted',
        description: `${selectedNodes.length} node(s) and ${selectedEdges.length} link(s) removed`
      });
    } else {
      toast({
        title: 'Nothing selected',
        description: 'Select nodes or links before deleting'
      });
    }
  }, [nodes, edges, deleteNode, deleteEdge, toast]);

  const handleClearCanvas = useCallback(() => {
    clearCanvas();
    setConfirmClearOpen(false);
    toast({
      title: 'Canvas cleared',
      description: 'All nodes and links have been removed'
    });
  }, [clearCanvas, toast]);

  const handleZoomIn = () => reactFlowInstance.zoomIn();
  const handleZoomOut = () => reactFlowInstance.zoomOut();
  const handleResetView = () => reactFlowInstance.fitView({ padding: 0.2 });

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between shadow-sm">
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded hover:bg-gray-100 flex items-center space-x-1 text-gray-700" 
            onClick={handleAddNode}
            title="Add Node"
          >
            <PlusSquare className="h-4 w-4" />
            <span className="text-sm">Add Node</span>
          </Button>
          <Button 
            variant={isAddingLink ? "secondary" : "ghost"}
            size="sm" 
            className="p-2 rounded hover:bg-gray-100 flex items-center space-x-1 text-gray-700" 
            onClick={handleToggleAddLink}
            title="Add Link"
          >
            <GitCommit className="h-4 w-4" />
            <span className="text-sm">Add Link</span>
          </Button>
          <div className="border-r border-gray-300 h-6 mx-1"></div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded hover:bg-gray-100 flex items-center space-x-1 text-gray-700" 
            onClick={handleDeleteSelected}
            title="Delete Selected"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm">Delete</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded hover:bg-gray-100 flex items-center space-x-1 text-gray-700" 
            onClick={() => setConfirmClearOpen(true)}
            title="Clear Canvas"
          >
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Clear All</span>
          </Button>
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-2 rounded hover:bg-gray-100 text-gray-700" 
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-2 rounded hover:bg-gray-100 text-gray-700" 
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-2 rounded hover:bg-gray-100 text-gray-700" 
            onClick={handleResetView}
            title="Reset View"
          >
            <Crosshair className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeDoubleClick={handleNodeDoubleClick}
          onEdgeDoubleClick={handleEdgeDoubleClick}
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={{
            style: { stroke: '#A31F36', strokeWidth: 2 },
            type: 'custom',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#A31F36',
            },
          }}
          className="canvas-container bg-[#f8f8f8]"
        >
          <Controls 
            position="bottom-right" 
            showInteractive={false}
            className="bg-white/90 border border-gray-200 rounded shadow-sm"
          />
          <Background 
            color="#ddd" 
            gap={20} 
            size={1}
            variant={BackgroundVariant.Dots} 
          />
        </ReactFlow>
      </div>

      {/* Edit Node Dialog */}
      <Dialog open={!!editNode} onOpenChange={(open) => !open && setEditNode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="node-title">Title</Label>
              <Input 
                id="node-title" 
                value={editNode?.label || ''} 
                onChange={(e) => setEditNode(prev => prev ? {...prev, label: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="node-description">Description</Label>
              <Textarea 
                id="node-description" 
                value={editNode?.description || ''}
                onChange={(e) => setEditNode(prev => prev ? {...prev, description: e.target.value} : null)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditNode(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNode}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Edge Dialog */}
      <Dialog open={!!editEdge} onOpenChange={(open) => !open && setEditEdge(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Enter the relationship between the connected nodes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edge-label">Link Text</Label>
              <Textarea 
                id="edge-label" 
                value={editEdge?.label || ''} 
                onChange={(e) => setEditEdge(prev => prev ? {...prev, label: e.target.value} : null)}
                rows={4}
                placeholder="Enter the relationship between these nodes (e.g., 'influences', 'leads to', 'contradicts')"
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEdge(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEdge}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Clear Dialog */}
      <Dialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Canvas</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear the entire canvas? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmClearOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearCanvas}>
              Clear Canvas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  );
}
