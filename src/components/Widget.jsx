import Draggable from "react-draggable";
import { useRef } from 'react';
import './styles.css';

export const Widget = ({ children, defaultPosition, width = 200, height = 200, widgetIcons }) => {
  const nodeRef = useRef(null);
  
  return (<Draggable
      defaultPosition={defaultPosition}
      nodeRef={nodeRef}
      position={null}
      grid={[25, 25]}
      scale={1}>
      <div ref={nodeRef} className="draggable-item" style={{ width: `${width}px`, height: `${height}px` }}>
        <div className="icons-container">
          {widgetIcons}
        </div>
        {children}
      </div>
    </Draggable>);
};
