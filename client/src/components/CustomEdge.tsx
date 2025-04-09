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
          width={300}
          height={1000} // Set a large enough height
          x={labelX - 150}
          y={labelY - 15} // Center vertically with a small offset
          className="edge-label-container"
          requiredExtensions="http://www.w3.org/1999/xhtml"
          style={{ overflow: 'visible', pointerEvents: 'none' }}
        >
          <div 
            className="px-3 py-2 bg-white border-2 border-crimson/70 rounded-lg shadow-sm text-center text-sm font-medium text-crimson inline-block"
            style={{ 
              maxWidth: '280px',
              margin: '0 auto',
              wordBreak: 'break-word', 
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              pointerEvents: 'auto'
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