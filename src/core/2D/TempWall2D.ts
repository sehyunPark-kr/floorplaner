import { Graphics, Text } from 'pixi.js';

import { Dimensioning } from '../Utile/Dimensioning';

import type { Corner } from '../Data/Corner';
import type { Vector2 } from '@babylonjs/core';

export class TempWall2D extends Graphics {
  private textfield: Text;

  public constructor() {
    super();
    this.textfield = new Text('Length: ', {
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 'black',
      align: 'center',
    });
    this.addChild(this.textfield);
  }

  public update(corner?: Corner, endPoint?: Vector2, startPoint?: Vector2) {
    this.clear();
    this.textfield.visible = false;

    if (corner && endPoint) {
      let pxStart = Dimensioning.toPixels(corner.point.clone());
      let pxEnd = Dimensioning.toPixels(endPoint.clone());

      // Wall Line
      this.lineStyle(10, 0x008cba);
      this.moveTo(pxStart.x, pxStart.y);
      this.lineTo(pxEnd.x, pxEnd.y);

      // Corner
      this.beginFill(0x008cba, 0.5);
      this.drawCircle(pxEnd.x, pxEnd.y, 10);

      // Length Text
      let vect = endPoint.clone().subtract(corner.point);
      let midPoint = pxEnd.clone().subtract(pxStart).scale(0.5).add(pxStart);
      this.textfield.position.x = midPoint.x;
      this.textfield.position.y = midPoint.y;
      this.textfield.text = Dimensioning.cmToMeasure(vect.length());
      this.textfield.visible = true;
    }

    if (startPoint) {
      let pxStart = Dimensioning.toPixels(startPoint);
      this.beginFill(0x008cba, 0.5);
      this.drawCircle(pxStart.x, pxStart.y, 10);
    }
  }
}
