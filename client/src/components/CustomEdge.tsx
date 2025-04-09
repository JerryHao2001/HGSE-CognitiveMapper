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
          width={150}
          height={40}
          x={labelX - 75}
          y={labelY - 20}
          className="edge-label-container"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="px-2 py-1 bg-white border-2 border-crimson/70 rounded-lg shadow-sm min-w-[100px] flex items-center justify-center text-center text-sm font-medium text-crimson break-words max-w-[150px]">
            {label}
          </div>
        </foreignObject>
      )}
    </>
  );
}

export default memo(CustomEdge);