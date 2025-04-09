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
  
  // Calculate the exact middle point between source and target
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  // Get the path for the edge
  const [edgePath] = getStraightPath({
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
          width={300}
          height={60} 
          x={midX - 150}
          y={midY - 30}
          className="edge-label-container"
          requiredExtensions="http://www.w3.org/1999/xhtml"
          style={{ overflow: 'visible' }}
        >
          <div 
            className="h-full w-full flex items-center justify-center"
          >
            <span 
              className="px-3 py-1 bg-white border-2 border-crimson/70 rounded-lg shadow-sm text-center text-sm font-medium text-crimson"
              style={{ 
                display: 'inline-block',
                maxWidth: '280px',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                overflowWrap: 'break-word'
              }}
            >
              {label}
            </span>
          </div>
        </foreignObject>
      )}
    </>
  );
}

export default memo(CustomEdge);