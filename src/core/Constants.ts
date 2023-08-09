// import Enum from 'es6-enum';

/** Dimensioning in Inch. */
export const dimInch = 'inch';

/** Dimensioning in feetAndInch. */
export const dimFeetAndInch = 'feetAndInch';

/** Dimensioning in Feet. */
export const dimFeet = 'feet';

/** Dimensioning in Meter. */
export const dimMeter = 'm';

/** Dimensioning in Centi Meter. */
export const dimCentiMeter = 'cm';

/** Dimensioning in Milli Meter. */
export const dimMilliMeter = 'mm';

export const availableDimUnits = [
  dimInch,
  dimFeetAndInch,
  dimFeet,
  dimMeter,
  dimCentiMeter,
  dimMilliMeter,
];

export const VIEW_TOP = 'topview';
export const VIEW_FRONT = 'frontview';
export const VIEW_RIGHT = 'rightview';
export const VIEW_LEFT = 'leftview';
export const VIEW_ISOMETRY = 'isometryview';

export const WALL_STANDARD_THICKNESS = 20; //in cm
export const WALL_OFFSET_THICKNESS = 15; //in cm
export const WALL_STANDARD_HEIGHT = 300; //in cm

export enum FloorplanerMode {
  MOVE = 0,
  DRAW = 1,
  EDIT_ISLANDS = 2,
}

// export const WallTypes = Enum('STRAIGHT', 'CURVED');
