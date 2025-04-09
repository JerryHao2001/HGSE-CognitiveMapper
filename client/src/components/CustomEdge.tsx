import { memo } from 'react';
import { EdgeProps, getStraightPath, BaseEdge } from 'reactflow';
import { CustomEdgeData } from '../types';

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data,
}: EdgeProps<CustomEdgeData>) {
  
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <foreignObject
          width={600}
          height={200}
          x={labelX - 300}
          y={labelY - 100}
          className="edge-label-container"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div 
            className="px-4 py-2 bg-white border-2 border-crimson/70 rounded-lg shadow-sm flex items-center justify-center text-center text-sm font-medium text-crimson mx-auto"
            style={{ 
              width: 'auto', 
              maxWidth: '580px', 
              height: 'auto',
              wordBreak: 'break-word', 
              overflowWrap: 'break-word', 
              whiteSpace: 'normal',
              overflow: 'visible',
              hyphens: 'auto'
            }}
          >
            {label}
          </div>
        </foreignObject>
      )}
    </>
  );
}

export default memo(CustomEdge);