import { Color3 } from '@babylonjs/core';
import { type ColorSource, FederatedPointerEvent, Text } from 'pixi.js';

import { Config } from '../Config';
import { ObservableManager } from '../Manager/ObservableManager';
import { Dimensioning } from '../Utile/Dimensioning';

import { Base2D } from './Base2D';

import type { Corner } from '../Data/Corner';
import type { Floorplan } from '../Data/Floorplan';

export class Corner2D extends Base2D {
  private textfield?: Text;
  private cornerRadius = 12.5;

  public constructor(floorplan: Floorplan, public corner: Corner) {
    super(floorplan);

    this.zIndex = 100;
    this.pivot.x = this.pivot.y = 0.5;

    this.drawHoveredOffState();
    this.drawText();
    this.updatePosition();
    ObservableManager.instance.onMovedCorner.add((corner) => this.updatePosition());
  }

  private draw(radius: number, borderColor: ColorSource, fillColor: ColorSource) {
    this.clear();
    let alpha = 0.5;
    let useRadius = radius;
    let insideRadius = useRadius * 0.55;
    let xOut = 0;
    let yOut = 0;
    this.beginFill(borderColor, alpha);
    this.drawCircle(xOut, yOut, useRadius);
    this.endFill();
    this.beginFill(fillColor, alpha);
    this.drawCircle(xOut, yOut, insideRadius);
    this.endFill();
  }
  public drawText() {
    // Dev
    this.textfield = new Text('Length: ', {
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 'white',
      align: 'center',
    });
    this.addChild(this.textfield);
    this.textfield.zIndex = 150;
    this.textfield.anchor.x = 0.5;
    this.textfield.anchor.y = 0.5;
    this.textfield.position.x = 0;
    this.textfield.position.y = 0;
    this.textfield.text = this.corner.id;
    this.textfield.visible = true;
  }
  private updatePosition() {
    let xx = Dimensioning.cmToPixel(this.corner.point.x);
    let yy = Dimensioning.cmToPixel(this.corner.point.y);
    this.position.x = xx;
    this.position.y = yy;
    ObservableManager.instance.onUpdateFloorplan.notifyObservers({
      floorplan: this.floorplan,
    });
  }
  public movePosition(evt: FederatedPointerEvent) {
    let point = Dimensioning.eventToPoint(this.parent, evt);

    if (Config.dragOnlyX && !Config.dragOnlyY) {
      point.y = this.corner.point.y;
    }

    if (!Config.dragOnlyX && Config.dragOnlyY) {
      point.x = this.corner.point.x;
    }

    this.corner.move(point.x, point.y);
  }

  //--------------------------------------------
  // Override
  //--------------------------------------------
  protected drawSelectedState() {
    super.drawSelectedState();

    let radius = this.cornerRadius;
    this.draw(radius, 0x04a9f5, 0x049995);
  }
  protected drawHoveredOnState() {
    super.drawHoveredOnState();

    let radius = this.cornerRadius * 1.0;
    this.draw(radius, 0x000000, 0x04a9f5);
  }
  protected drawHoveredOffState() {
    super.drawHoveredOffState();

    let radius = this.cornerRadius;
    this.draw(radius, 0xcccccc, 0x000000);
  }
}
