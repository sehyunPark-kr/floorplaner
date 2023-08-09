import { Vector2, Vector3 } from '@babylonjs/core';

import { Config } from '../Config';
import {
  dimCentiMeter,
  dimFeet,
  dimFeetAndInch,
  dimInch,
  dimMeter,
  dimMilliMeter,
} from '../Constants';

import type { DisplayObject, FederatedPointerEvent } from 'pixi.js';

export const decimals = 1000;

export const cmPerFoot = 30.48;
export const pixelsPerFoot = 5.0;

export const pixelsPerCm = 0.5;
export const cmPerPixel = 1.0 / pixelsPerCm;

export const dimensioningOptions = [
  dimInch,
  dimFeetAndInch,
  dimMeter,
  dimCentiMeter,
  dimMilliMeter,
];

/** Dimensioning functions. */
export class Dimensioning {
  static cmToPixelVector2D(cmV2d: Vector2) {
    let pixelV2d = new Vector2(Dimensioning.cmToPixel(cmV2d.x), Dimensioning.cmToPixel(cmV2d.y));
    return pixelV2d;
  }

  static cmToPixelVector3D(cmV3d: Vector3) {
    let pixelV2d = new Vector3(
      Dimensioning.cmToPixel(cmV3d.x),
      Dimensioning.cmToPixel(cmV3d.y),
      Dimensioning.cmToPixel(cmV3d.z)
    );
    return pixelV2d;
  }

  static pixelToCmVector2D(pixelV2d: Vector2) {
    let cmV2d = new Vector2(Dimensioning.cmToPixel(pixelV2d.x), Dimensioning.cmToPixel(pixelV2d.y));
    return cmV2d;
  }

  static pixelToCmVector3D(pixel3d: Vector3) {
    let cmV2d = new Vector3(
      Dimensioning.cmToPixel(pixel3d.x),
      Dimensioning.cmToPixel(pixel3d.y),
      Dimensioning.cmToPixel(pixel3d.z)
    );
    return cmV2d;
  }

  static cmToPixel(cm: number, apply_scale: boolean = true) {
    if (apply_scale) {
      return cm * pixelsPerCm * Config.scale;
    }
    return cm * pixelsPerCm;
  }

  static toPixels(vector: Vector2) {
    vector.x = Dimensioning.cmToPixel(vector.x);
    vector.y = Dimensioning.cmToPixel(vector.y);
    return vector;
  }

  static pixelToCm(pixel: number, apply_scale = true) {
    if (apply_scale) {
      return pixel * cmPerPixel * (1.0 / Config.scale);
    }
    return pixel * cmPerPixel;
  }

  static roundOff(value: number, decimals: number) {
    return Math.round(decimals * value) / decimals;
  }
  /** Converts cm to dimensioning number.
   * @param cm Centi meter value to be converted.
   * @returns Number representation.
   */
  static cmFromMeasureRaw(measure: number) {
    switch (Config.dimUnit) {
      case dimFeet:
      case dimFeetAndInch:
        return Math.round(decimals * (measure * 30.480016459203095991)) / decimals;
      case dimInch:
        return Math.round(decimals * (measure * 2.5400013716002578512)) / decimals;
      case dimMilliMeter:
        return Math.round(decimals * (measure * 0.10000005400001014955)) / decimals;
      case dimCentiMeter:
        return measure;
      case dimMeter:
      default:
        return Math.round(decimals * 100 * measure) / decimals;
    }
  }

  static cmToMeasureUnit(cm: number, power: number = 1, unit: number) {
    switch (Config.dimUnit) {
      case dimFeet:
        var allInFeet = cm * Math.pow(0.032808416666669996953, power);
        allInFeet = Dimensioning.roundOff(allInFeet, 2);
        return `${allInFeet}"`;
      case dimFeetAndInch:
        var allInFeet = cm * Math.pow(0.032808416666669996953, power);
        var floorFeet = Math.floor(allInFeet);
        var remainingFeet = allInFeet - floorFeet;
        var remainingInches = Math.round(remainingFeet * 12);
        return `${floorFeet}" ${remainingInches}'`;
      // return floorFeet + '\'' + remainingInches + '';
      case dimInch:
        var inches = Math.round(decimals * (cm * Math.pow(0.3937, power))) / decimals;
        return `${inches}'`;
      // return inches + '\'';
      case dimMilliMeter:
        var mm = Math.round(decimals * (cm * Math.pow(10, power))) / decimals;
        return `${mm} mm`;
      // return '' + mm + 'mm';
      case dimCentiMeter:
        return `${Math.round(decimals * cm) / decimals} cm`;
      // return '' + Math.round(decimals * cm) / decimals + 'cm';
      case dimMeter:
      default:
        var m = Math.round(decimals * (cm * Math.pow(0.01, power))) / decimals;
        return `${m} m`;
      // return '' + m + 'm';
    }
  }

  /** Converts cm to dimensioning string.
   * @param cm Centi meter value to be converted.
   * @returns String representation.
   */
  static cmFromMeasure(measure: number) {
    switch (Config.dimUnit) {
      case dimFeet:
      case dimFeetAndInch:
        return Math.round(decimals * (measure * 30.480016459203095991)) / decimals + 'cm';
      case dimInch:
        return Math.round(decimals * (measure * 2.5400013716002578512)) / decimals + 'cm';
      case dimMilliMeter:
        return Math.round(decimals * (measure * 0.10000005400001014955)) / decimals + 'cm';
      case dimCentiMeter:
        return measure;
      case dimMeter:
      default:
        return Math.round(decimals * 100 * measure) / decimals + 'cm';
    }
  }

  /** Converts cm to dimensioning string.
   * @param cm Centi meter value to be converted.
   * @returns String representation.
   */
  static cmToMeasureRaw(cm: number, power: number = 1) {
    switch (Config.dimUnit) {
      case dimFeet:
      case dimFeetAndInch: // dimFeetAndInch returns only the feet
        var allInFeet = cm * Math.pow(0.032808416666669996953, power);
        return allInFeet;
      case dimInch:
        var inches = Math.round(decimals * (cm * Math.pow(0.3937, power))) / decimals;
        return inches;
      case dimMilliMeter:
        var mm = Math.round(decimals * (cm * Math.pow(10, power))) / decimals;
        return mm;
      case dimCentiMeter:
        return Math.round(decimals * cm) / decimals;
      case dimMeter:
      default:
        var m = Math.round(decimals * (cm * Math.pow(0.01, power))) / decimals;
        return m;
    }
  }

  /** Converts cm to dimensioning string.
   * @param cm Centi meter value to be converted.
   * @returns String representation.
   */
  static cmToMeasure(cm: number, power: number = 1) {
    switch (Config.dimUnit) {
      case dimFeet:
        var allInFeet = cm * Math.pow(0.032808416666669996953, power);
        allInFeet = Dimensioning.roundOff(allInFeet, 2);
        return `${allInFeet}"`;
      case dimFeetAndInch:
        var allInFeet = cm * Math.pow(0.032808416666669996953, power);
        var floorFeet = Math.floor(allInFeet);
        var remainingFeet = allInFeet - floorFeet;
        var remainingInches = Math.round(remainingFeet * 12);
        return `${floorFeet}" ${remainingInches}'`;
      case dimInch:
        var inches = Math.round(decimals * (cm * Math.pow(0.3937, power))) / decimals;
        return `${inches}'`;
      case dimMilliMeter:
        var mm = Math.round(decimals * (cm * Math.pow(10, power))) / decimals;
        return '' + mm + 'mm';
      case dimCentiMeter:
        return '' + Math.round(decimals * cm) / decimals + 'cm';
      case dimMeter:
      default:
        var m = Math.round(decimals * (cm * Math.pow(0.01, power))) / decimals;
        return '' + m + 'm';
    }
  }

  static cmToMeter(cm: number) {
    return cm / 100;
  }
  static eventToPoint(parent: DisplayObject, event: FederatedPointerEvent): Vector2 {
    const localPosition = event.data.getLocalPosition(parent);
    const cmCo = new Vector2(
      Dimensioning.pixelToCm(localPosition.x),
      Dimensioning.pixelToCm(localPosition.y)
    );

    if (Config.snapToGrid) {
      const snapTolerance = Config.snapTolerance;
      const snappedX = this.snapValueToGrid(cmCo.x, snapTolerance);
      const snappedY = this.snapValueToGrid(cmCo.y, snapTolerance);
      cmCo.set(snappedX, snappedY);
    }

    return cmCo;
  }

  static snapValueToGrid(value: number, snapTolerance: number): number {
    const snappedValue1 = Math.floor(value / snapTolerance) * snapTolerance;
    const snappedValue2 = Math.floor((value + snapTolerance) / snapTolerance) * snapTolerance;

    const diff1 = Math.abs(snappedValue1 - value);
    const diff2 = Math.abs(snappedValue2 - value);

    return diff1 < diff2 ? snappedValue1 : snappedValue2;
  }
}
