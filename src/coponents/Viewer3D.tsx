import { createRef, useEffect, useState } from 'react';

import { ZED3D } from 'src/core/ZED3D';

import '../viewer.scss';

export default function Viewer3D() {
  const canvasRef = createRef<HTMLCanvasElement>();

  const [zed3D, setZED3D] = useState<ZED3D>();

  useEffect(() => {
    if (!canvasRef.current) return;

    setZED3D(new ZED3D(canvasRef.current));

    return () => {
      zed3D?.dispose();
    };
  }, []);

  return (
    <div className="viewer-3d-pane-background">
      <canvas className="viewer-3d-pane-canvas" ref={canvasRef}></canvas>
    </div>
  );
}
