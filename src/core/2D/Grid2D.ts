import { Vector2 } from '@babylonjs/core';
import { Graphics } from 'pixi.js';

import { Config } from '../Config';
import { Dimensioning } from '../Utile/Dimensioning';

const GRID_SIZE = 10000;
export class Grid2D extends Graphics {
  private size: Vector2;
  public gridScale: number;
  private normalColor: number;
  private highlightColor: number;
  public constructor() {
    super();
    this.zIndex = 0;
    this.size = new Vector2(GRID_SIZE, GRID_SIZE);
    this.gridScale = 1.0;
    this.normalColor = 0xe0e0e0;
    this.highlightColor = 0xd0d0d0;
    this.width = this.size.x;
    this.height = this.size.y;
    this.drawRect(0, 0, GRID_SIZE, GRID_SIZE);
    this.pivot.x = this.pivot.y = 0.5;

    this.update();
  }

  public setGridScale(value: number) {
    this.gridScale = value;
    this.update();
  }

  private update() {
    let gridSize = Dimensioning.cmToPixel(Config.viewBounds * 1);
    let spacingCMS = Config.gridSpacing;
    let spacing = Dimensioning.cmToPixel(spacingCMS);
    let totalLines = gridSize / spacing;
    let halfSize = gridSize * 0.5;
    let linewidth = Math.max(1.0 / this.gridScale, 1.0);
    let highlightLineWidth = Math.max(2.0 / this.gridScale, 1.0);
    this.clear();
    for (let i = 0; i < totalLines; i++) {
      let co = i * spacing - halfSize;
      if (i % 5 === 0) {
        this.lineStyle(highlightLineWidth, this.highlightColor)
          .moveTo(-halfSize, co)
          .lineTo(halfSize, co);
        this.lineStyle(highlightLineWidth, this.highlightColor)
          .moveTo(co, -halfSize)
          .lineTo(co, halfSize);
      } else {
        this.lineStyle(linewidth, this.normalColor).moveTo(-halfSize, co).lineTo(halfSize, co);
        this.lineStyle(linewidth, this.normalColor).moveTo(co, -halfSize).lineTo(co, halfSize);
      }
    }
  }
}
