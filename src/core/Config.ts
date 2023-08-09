import { dimCentiMeter, WALL_STANDARD_HEIGHT, WALL_STANDARD_THICKNESS } from './Constants';

export const Config = {
  dimUnit: dimCentiMeter,
  wallHeight: WALL_STANDARD_HEIGHT,
  wallThickness: WALL_STANDARD_THICKNESS,
  systemUI: false,
  scale: 1,
  snapToGrid: true,
  dragOnlyX: false,
  dragOnlyY: false,
  snapTolerance: 50,
  gridSpacing: 50,
  directionalDrag: true,
  magneticSnap: true,
  itemStatistics: true,
  boundsX: 500,
  boundsY: 500,
  viewBounds: 10000,
  viewportWorldWidth: 3000,
  viewportWorldHeight: 3000,
};
