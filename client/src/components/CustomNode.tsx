import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData } from '../types';

const CustomNode = ({ data, selected, id }: NodeProps<CustomNodeData>) => {
  return (
    <div
      className={`px-3 py-2 rounded-lg bg-white border-2 ${
        selected ? 'border-crimson shadow-md' : 'border-crimson/70'
      } min-w-[150px] max-w-[200px] shadow hover:shadow-md transition-shadow duration-200`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-crimson" />
      <div className="font-semibold text-crimson">{data.label}</div>
      {data.description && (
        <div className="text-sm text-gray-700 mt-1">{data.description}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-crimson" />
    </div>
  );
};

export default memo(CustomNode);
