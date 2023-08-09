import React, { useEffect } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';

import Viewer2D from './Viewer2D';
import Viewer3D from './Viewer3D';

import '../viewer.scss';

function Viewer() {
  return (
    <ReflexContainer orientation="vertical">
      <ReflexElement className="viewer-2d-pane" name="leftPane">
        <Viewer2D></Viewer2D>
      </ReflexElement>

      <ReflexSplitter />

      <ReflexElement flex={0.25}>
        <ReflexContainer orientation="horizontal">
          <ReflexElement className="options-pane">
            <label>Settings</label>
          </ReflexElement>

          <ReflexSplitter />

          <ReflexElement className="viewer-3d-pane">
            <Viewer3D></Viewer3D>
          </ReflexElement>
        </ReflexContainer>
      </ReflexElement>
    </ReflexContainer>
  );
}
export default Viewer;
