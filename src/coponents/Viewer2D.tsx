import { createRef, useEffect, useState } from 'react';

import { ZED2D } from 'src/core/ZED2D';

import '../viewer.scss';
import ModeButtons from './ModeButtons';

export default function Viewer2D() {
  const canvasRef = createRef<HTMLDivElement>();

  const [zed2D, setZED2D] = useState<ZED2D>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const zed2DInstance = new ZED2D(canvasRef.current);
    setZED2D(zed2DInstance);

    return () => {
      zed2DInstance.dispose();
    };
  }, []);

  return (
    <div ref={canvasRef}>
      <div className="viewer-2d-pane-texts">
        {zed2D && <ModeButtons zed2D={zed2D} />}
        <br />
        <br />
        <text>
          Q : move mode
          <br />
        </text>
        <text>
          W : draw mode
          <br />
        </text>
        <text>
          Shift : snapToGrid on/off
          <br />
        </text>
        <text>
          ESC : unselected, move mode
          <br />
        </text>
      </div>
    </div>
  );
}
