import { Corner2D } from '../2D/Corner2D';
import { Wall2D } from '../2D/Wall2D';

import { Corner } from './Corner';
import { Wall } from './Wall';

import type { Vector2, Vector3 } from '@babylonjs/core';
import type { Viewport } from 'pixi-viewport';

export class Floorplan {
  public walls: Wall[] = [];
  public corners: Corner[] = [];
  public constructor(private viewport: Viewport) {}
  public reset() {
    this.walls = [];
    this.corners = [];
  }

  public addWall(start: Corner, end: Corner) {
    let alreadyGeneratedWall: Wall | undefined = undefined;
    for (const wall of this.walls) {
      if (
        (wall.start === start || wall.end === start) &&
        (wall.start === end || wall.end === end)
      ) {
        alreadyGeneratedWall = wall;
        break;
      }
    }
    if (alreadyGeneratedWall) {
      return alreadyGeneratedWall;
    }
    const wall = new Wall(start, end);
    this.walls.push(wall);

    const wall2D = new Wall2D(this, wall);
    this.viewport.addChild(wall2D);

    return wall;
  }

  public addCorner(point: Vector2) {
    let alreadyGeneratedCorner: Corner | undefined = undefined;
    for (const corner of this.corners) {
      if (corner.point.x === point.x && corner.point.y === point.y) {
        alreadyGeneratedCorner = corner;
        break;
      }
    }
    if (alreadyGeneratedCorner) {
      return alreadyGeneratedCorner;
    }

    const corner = new Corner(point);
    this.corners.push(corner);

    const corner2D = new Corner2D(this, corner);
    this.viewport.addChild(corner2D);

    return corner;
  }

}
