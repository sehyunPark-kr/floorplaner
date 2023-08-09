import { Vector2 } from '@babylonjs/core';
import { FederatedPointerEvent, Graphics } from 'pixi.js';

import { ObservableManager } from '../Manager/ObservableManager';
import { Dimensioning } from '../Utile/Dimensioning';

import type { Floorplan } from '../Data/Floorplan';

export class Base2D extends Graphics {
  protected isButtonMode = true;
  protected isSelected = false;
  protected isInteractable = true;
  //--------------------------------------------
  public get selected() {
    return this.isSelected;
  }
  public set selected(flag: boolean) {
    this.isSelected = flag;
    // if (!this.isSelected) {
    //   this.drawHoveredOffState();
    // }

    if (flag) {
      ObservableManager.instance.onSelected2DElement.notifyObservers({
        base2D: this,
      });
    } else {
      ObservableManager.instance.onUnselected2DElement.notifyObservers({
        base2D: this,
      });
    }
  }
  public get interactable() {
    return this.isInteractable;
  }
  public set interactable(flag: boolean) {
    this.isInteractable = flag;
    this.isButtonMode = flag;
  }

  //--------------------------------------------
  protected constructor(protected floorplan: Floorplan) {
    super();

    this.interactive = true;
    this.selected = false;

    this.addListener('mousedown', (event) => this.onMouseDown(event));
    this.addListener('mouseup', (event) => this.onMouseUp(event));
    this.addListener('touchstart', (event) => this.onMouseDown(event));
    this.addListener('touchend', (event) => this.onMouseUp(event));

    this.addListener('mouseover', (event) => this.onMouseOver(event));
    this.addListener('mouseout', (event) => this.onMouseOut(event));
  }

  //--------------------------------------------
  protected onMouseDown(event: FederatedPointerEvent) {
    this.selected = true;
    this.drawSelectedState();
    event?.stopPropagation();
  }
  protected onMouseUp(event: FederatedPointerEvent) {
    this.selected = false;
    this.drawHoveredOffState();
    event?.stopPropagation();
  }
  protected onMouseOver(event: FederatedPointerEvent) {
    // console.log('onMouseOver');
    if (!this.selected) {
      this.drawHoveredOnState();
      event?.stopPropagation();
    }
  }
  protected onMouseOut(event: FederatedPointerEvent) {
    // console.log('onMouseOut');
    if (!this.selected) {
      this.drawHoveredOffState();
      event?.stopPropagation();
    }
  }

  //--------------------------------------------
  protected drawSelectedState() {
    // console.log('drawSelectedState');
  }
  protected drawHoveredOnState() {
    // console.log('drawHoveredOnState');
  }
  protected drawHoveredOffState() {
    // console.log('drawHoveredOffState');
  }
}
