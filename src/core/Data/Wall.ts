import { Vector2 } from '@babylonjs/core';

import { Config } from '../Config';
import { Dimensioning } from '../Utile/Dimensioning';

import type { Corner } from './Corner';

export class Wall {
  private _location: Vector2;
  constructor(public start: Corner, public end: Corner) {
    this._location = this.midPoint.clone();
  }

  get direction() {
    let vector = this.end.point.clone().subtract(this.start.point);
    return vector;
  }
  get directionNormalized() {
    return this.direction.normalize();
  }
  get perpendicularNormalized() {
    const direction = this.directionNormalized;
    const perpendicular = new Vector2(direction.y, -direction.x);
    return perpendicular;
  }
  get midPoint() {
    return this.start.point.clone().add(this.direction.clone().scale(0.5));
  }
  get location() {
    return this._location;
  }
  get polygones() {
    const width = 10;
    const direction = this.directionNormalized;
    const perpendicular = this.perpendicularNormalized;

    const topLeft = this.start.point.clone().add(perpendicular.clone().scale(width));
    const topRight = this.end.point.clone().add(perpendicular.clone().scale(width));
    const bottomLeft = this.start.point.clone().subtract(perpendicular.clone().scale(width));
    const bottomRight = this.end.point.clone().subtract(perpendicular.clone().scale(width));

    return [topLeft, topRight, bottomRight, bottomLeft];
  }
  set location(pxPoint: Vector2) {
    const _location = this._location.clone();

    let diff = Vector2.Zero();
    if (Config.snapToGrid) {
      const snapTolerance = Config.snapTolerance;
      const _location_x = Math.floor(_location.x / snapTolerance) * snapTolerance;
      const _location_y = Math.floor(_location.y / snapTolerance) * snapTolerance;
      diff = pxPoint.clone().subtract(new Vector2(_location_x, _location_y));
    } else {
      diff = pxPoint.clone().subtract(_location);
    }

    if (diff.x === 0 && diff.y === 0) return;

    this.start.relativeMove(diff.x, diff.y);
    this.end.relativeMove(diff.x, diff.y);
    this._location = this.midPoint.clone();
  }

  public move(newX: number, newY: number) {
    let dx = newX - (this.start.point.x + this.end.point.x) * 0.5;
    let dy = newY - (this.start.point.y + this.end.point.y) * 0.5;
    this.relativeMove(dx, dy);
  }

  public relativeMove(dx: number, dy: number) {
    this.start.relativeMove(dx, dy);
    this.end.relativeMove(dx, dy);
    this.updateControlVectors();
  }

  public updateControlVectors() {
    this._location = this.midPoint.clone();
  }
}
