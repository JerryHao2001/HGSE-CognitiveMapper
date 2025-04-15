import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData } from '../types';

const CustomNode = ({ data, selected, id }: NodeProps<CustomNodeData>) => {
  return (
    <div
      className={`px-3 py-2 rounded-lg bg-white border-2 ${
        selected ? 'border-crimson shadow-md' : 'border-crimson/70'
      } min-w-[150px] max-w-[200px] shadow hover:shadow-md transition-shadow duration-200 relative`}
    >
      {/* One handle on each side that works as both source and target */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-crimson" 
        id="top"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-crimson" 
        id="right"
      />
      <Handle 
        type="target" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-crimson" 
        id="bottom"
      />
      <Handle 
        type="source" 
        position={Position.Left} 
        className="w-3 h-3 bg-crimson" 
        id="left"
      /> 
        className="w-3 h-3 bg-crimson opacity-0" 
        id="left"
      />
      
      {/* Content */}
      <div className="font-semibold text-crimson">{data.label}</div>
      {data.description && (
        <div className="text-sm text-gray-700 mt-1">{data.description}</div>
      )}
    </div>
  );
};

export default memo(CustomNode);
