import Draggable from "react-draggable";
import { useRef } from 'react';
import { DragOutlined } from '@ant-design/icons';
import './styles.css';

export const Widget = ({ children, defaultPosition, width = 200, height = 200 }) => {
  const nodeRef = useRef(null);
  
  return (
    <Draggable
      defaultPosition={defaultPosition}
      nodeRef={nodeRef}
      position={null}
      grid={[25, 25]}
      scale={1}>
      <div ref={nodeRef} className="draggable-item" style={{ width: `${width}px`, height: `${height}px` }}>
        <DragOutlined className="draggable-icon"/>
        {children}
      </div>
    </Draggable>
  );
};
