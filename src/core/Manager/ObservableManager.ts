import { Observable } from '@babylonjs/core';

import type { Base2D } from '../2D/Base2D';
import type { Wall2D } from '../2D/Wall2D';
import type { FloorplanerMode } from '../Constants';
import type { Corner } from '../Data/Corner';
import type { Floorplan } from '../Data/Floorplan';
import type { Wall } from '../Data/Wall';
import type { FederatedPointerEvent } from 'pixi.js';
export class ObservableManager {
  private static singletonInstance: ObservableManager | undefined;
  public static get instance(): ObservableManager {
    if (this.singletonInstance === undefined) {
      this.singletonInstance = new ObservableManager();
    }
    return this.singletonInstance;
  }

  private constructor(
    public onKeyDown = new Observable<onKeyDownProp>(),
    public onKeyUp = new Observable<onKeyUpProp>(),
    public onSelected2DElement = new Observable<onSelected2DElementProp>(),
    public onUnselected2DElement = new Observable<onUnselected2DElementProp>(),
    public onMovedCorner = new Observable<onMovedCornerProp>(),
    public onChangeMode = new Observable<onChangeModeProp>(),
    public onUpdateFloorplan = new Observable<onUpdateFloorplanProp>(),
    public onMouseDown2DWall = new Observable<onMouseDown2DWallProp>()
  ) {
    window.addEventListener('keydown', (event) => this.onKeyDown.notifyObservers({ event: event }));
    window.addEventListener('keyup', (event) => this.onKeyUp.notifyObservers({ event: event }));
  }

  reset = () => {
    this.onKeyDown.clear();
    this.onKeyUp.clear();
    this.onSelected2DElement.clear();
    this.onUnselected2DElement.clear();
    this.onMovedCorner.clear();
    this.onChangeMode.clear();
    this.onUpdateFloorplan.clear();
    this.onMouseDown2DWall.clear();
  };
}

export interface onMouseDown2DWallProp {
  wall2d: Wall2D;
  event: FederatedPointerEvent;
}
export interface onKeyDownProp {
  event: KeyboardEvent;
}
export interface onKeyUpProp {
  event: KeyboardEvent;
}
export interface onSelected2DElementProp {
  base2D: Base2D;
}
export interface onUnselected2DElementProp {
  base2D: Base2D;
}
export interface onMovedCornerProp {
  corner: Corner;
}
export interface onChangeModeProp {
  mode: FloorplanerMode;
}
export interface onUpdateFloorplanProp {
  floorplan: Floorplan;
}
