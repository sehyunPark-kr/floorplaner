import { type Vector2, Vector3 } from '@babylonjs/core';

import { ObservableManager } from '../Manager/ObservableManager';
import { Dimensioning } from '../Utile/Dimensioning';

export class Corner {
  static ID = 0;
  public id: number;
  constructor(public point: Vector2) {
    this.id = Corner.ID++;
  }

  public move(x: number, y: number) {
    if (this.point.x !== x || this.point.y !== y) {
      this.point.x = x;
      this.point.y = y;
      ObservableManager.instance.onMovedCorner.notifyObservers({ corner: this });
    }
  }

  public relativeMove(dx: number, dy: number) {
    this.move(this.point.x + dx, this.point.y + dy);
  }

  get point3D() {
    const p3 = new Vector3(
      Dimensioning.cmToMeter(this.point.x),
      0,
      -Dimensioning.cmToMeter(this.point.y)
    );
    return p3;
  }
}
