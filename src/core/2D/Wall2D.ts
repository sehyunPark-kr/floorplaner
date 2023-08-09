import { Color3, Vector2, Vector3 } from '@babylonjs/core';
import { type ColorSource, FederatedPointerEvent, Graphics, Point, Text } from 'pixi.js';

import { Config } from '../Config';
import { ObservableManager, type onChangeModeProp } from '../Manager/ObservableManager';
import { Dimensioning } from '../Utile/Dimensioning';

import { Base2D } from './Base2D';

import type { FloorplanerMode } from '../Constants';
import type { Corner } from '../Data/Corner';
import type { Floorplan } from '../Data/Floorplan';
import type { Wall } from '../Data/Wall';

export class Wall2D extends Base2D {
  private textfield: Text;

  private lineColor = Color3.FromHexString('#000000').toHexString();
  private inerLineColor = Color3.FromHexString('#3EDEDE').toHexString();

  private mode?: FloorplanerMode;
  public constructor(floorplan: Floorplan, public wall: Wall) {
    super(floorplan);

    this.zIndex = 50;
    this.pivot.x = this.pivot.y = 0.5;
    this.textfield = new Text('Length: ', {
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 'black',
      align: 'center',
    });
    this.addChild(this.textfield);

    this.update();

    ObservableManager.instance.onMovedCorner.add((prop) => this.update());
    ObservableManager.instance.onChangeMode.add((prop) => this.onChangeMode(prop));
  }

  public update(lineColor?: ColorSource, inerLineColor?: ColorSource) {
    this.clear();

    let pxStart = Dimensioning.toPixels(this.wall.start.point.clone());
    let pxEnd = Dimensioning.toPixels(this.wall.end.point.clone());

    this.drawLine(lineColor);
    this.drawInnerLine(pxStart, pxEnd, inerLineColor);
    this.drawText(pxStart, pxEnd);
  }
  public drawLine(lineColor?: ColorSource) {
    const polygones = this.wall.polygones;
    const points = polygones.map(
      (polygon) => new Point(Dimensioning.cmToPixel(polygon.x), Dimensioning.cmToPixel(polygon.y))
    );
    this.beginFill(lineColor, 0.85);
    this.drawPolygon(points);
    this.endFill();
  }
  public drawInnerLine(pxStart: Vector2, pxEnd: Vector2, inerLineColor?: ColorSource) {
    this.lineStyle(2, inerLineColor ?? this.inerLineColor);
    this.moveTo(pxStart.x, pxStart.y);
    this.lineTo(pxEnd.x, pxEnd.y);
  }
  public drawText(pxStart: Vector2, pxEnd: Vector2) {
    let midPoint = pxEnd.clone().add(pxStart).scale(0.5);
    this.textfield.anchor.x = 0.5;
    this.textfield.anchor.y = 0;
    this.textfield.position.x = midPoint.x;
    this.textfield.position.y = midPoint.y;
    this.textfield.text = Dimensioning.cmToMeasure(this.wall.direction.length());
    this.textfield.visible = true;
  }
  public movePosition(evt: FederatedPointerEvent) {
    let point = Dimensioning.eventToPoint(this.parent, evt);

    if (Config.directionalDrag) {
      // let perpendicular = this.wall.perpendicularNormalized;
      // let vectorToProjected = point.clone().subtract(perpendicular);
      // if (Config.snapToGrid) {
      //   const snapTolerance = Config.snapTolerance;
      //   let snappedLength = Math.floor(vectorToProjected.length() / snapTolerance) * snapTolerance;
      //   vectorToProjected = vectorToProjected.normalize().scale(snappedLength);
      // }
      // point = this.wall.location.clone().add(vectorToProjected);
    }

    if (Config.dragOnlyX && !Config.dragOnlyY) {
      point.y = this.wall.location.y;
    }

    if (!Config.dragOnlyX && Config.dragOnlyY) {
      point.x = this.wall.location.x;
    }

    // console.log(point);
    this.wall.location = point;
    evt.stopPropagation();
  }

  private onChangeMode(prop: onChangeModeProp) {
    this.mode = prop.mode;
  }
  public setEnd(end: Corner) {
    this.wall.end = end;
    this.update();
  }
  //--------------------------------------------
  // Override
  //--------------------------------------------
  protected drawSelectedState() {
    super.drawSelectedState();

    this.update(0x049995);
  }
  protected drawHoveredOnState() {
    super.drawHoveredOnState();

    this.update(0x04a9f5);
  }
  protected drawHoveredOffState() {
    super.drawHoveredOffState();

    this.update();
  }
  protected onMouseDown(event: FederatedPointerEvent) {
    super.onMouseDown(event);

    ObservableManager.instance.onMouseDown2DWall.notifyObservers({
      wall2d: this,
      event: event,
    });
  }
}
