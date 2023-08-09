import { Vector2, Vector3 } from '@babylonjs/core';
import { type IViewportOptions, Viewport } from 'pixi-viewport';
import {
  Application,
  EventSystem,
  FederatedPointerEvent,
  Graphics,
  type IApplicationOptions,
} from 'pixi.js';

import { Corner2D } from './2D/Corner2D';
import { Grid2D } from './2D/Grid2D';
import { TempWall2D } from './2D/TempWall2D';
import { Wall2D } from './2D/Wall2D';
import { Config } from './Config';
import { FloorplanerMode } from './Constants';
import { Corner } from './Data/Corner';
import { Floorplan } from './Data/Floorplan';
import {
  ObservableManager,
  type onKeyDownProp,
  type onKeyUpProp,
  type onMouseDown2DWallProp,
  type onSelected2DElementProp,
  type onUnselected2DElementProp,
} from './Manager/ObservableManager';
import { IS_TOUCH_DEVICE } from './Utile/DeviceInfo';
import { Dimensioning } from './Utile/Dimensioning';

import type { Base2D } from './2D/Base2D';

export class ZED2D {
  private mode!: FloorplanerMode;
  private currentWidth!: number;
  private currentHeight!: number;

  private app!: Application;
  private eventSystem!: EventSystem;
  private viewport!: Viewport;
  private grid2D!: Grid2D;

  private tempWall2DHolder!: Graphics;
  private tempWall2D!: TempWall2D;
  private lastCorner?: Corner;

  private floorplan!: Floorplan;

  private selected2D?: Base2D;

  //-------------------------------------------
  // Initialize & Dispose
  //-------------------------------------------
  public constructor(private canvas: HTMLDivElement) {
    this.initialize();
  }
  private initialize() {
    this.currentWidth = window.innerWidth;
    this.currentHeight = window.innerHeight;

    // Create App
    this.app = new Application({
      backgroundColor: 0xffffff,
      width: this.currentWidth,
      height: this.currentHeight,
    });
    this.canvas.appendChild(this.app.view as unknown as Node);
    this.eventSystem = new EventSystem(this.app.renderer);

    // Create Viewport
    this.viewport = new Viewport({
      screenWidth: this.currentWidth,
      screenHeight: this.currentHeight,
      worldWidth: Config.viewportWorldWidth,
      worldHeight: Config.viewportWorldHeight,
      events: this.app.renderer.events, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      passiveWheel: false,
    });
    this.viewport.drag().pinch().wheel();
    this.viewport.sortableChildren = true;
    this.app.stage.addChild(this.viewport);

    // Create Data
    this.floorplan = new Floorplan(this.viewport);

    // Create Grid
    this.grid2D = new Grid2D();
    this.viewport.addChild(this.grid2D);

    // Create Temp Wall
    this.tempWall2D = new TempWall2D();
    this.tempWall2D.visible = false;

    this.tempWall2DHolder = new Graphics();
    this.tempWall2DHolder.addChild(this.tempWall2D);

    this.app.stage.addChild(this.tempWall2DHolder);

    // Add Viewport Events
    this.viewport.addListener('zoomed', (event) => this.onZoomed());

    this.viewport.addListener('moved', (event) => this.onMoved());

    this.viewport.addListener('mousedown', (event) => this.onMouseDown(event));
    this.viewport.addListener('mouseup', (event) => this.onMouseUp(event));
    this.viewport.addListener('mousemove', (event) => this.onMouseMove(event));

    this.viewport.addListener('touchstart', (event) => this.onMouseUp(event));
    this.viewport.addListener('touchend', (event) => this.onMouseUp(event));
    this.viewport.addListener('touchmove', (event) => this.onMouseMove(event));

    // Add Window Events
    window.addEventListener('resize', (event) => this.onResize());
    window.addEventListener('orientationchange', (event) => this.onResize());

    // Add KeyInput Events
    ObservableManager.instance.onKeyDown.add((event) => this.onKeyDown(event));
    ObservableManager.instance.onKeyUp.add((event) => this.onKeyUp(event));

    ObservableManager.instance.onSelected2DElement.add((base) => this.onSelected2DElement(base));
    ObservableManager.instance.onUnselected2DElement.add((base) =>
      this.onUnselected2DElement(base)
    );
    ObservableManager.instance.onMouseDown2DWall.add((event) => this.onMouseDown2DWall(event));

    // Init
    this.lastCorner = undefined;
    this.viewport.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5);
    this.onResize();
    this.fitCenter();
    this.switchMode(FloorplanerMode.MOVE);
  }
  public dispose() {
    this.grid2D.destroy();
    this.viewport.destroy();
    this.app.destroy();
  }

  //-------------------------------------------
  // Events
  //-------------------------------------------
  private onResize() {
    let heightMargin = this.canvas.offsetTop;
    let widthMargin = this.canvas.offsetLeft;

    let w = window.innerWidth - widthMargin;
    let h = window.innerHeight - heightMargin;

    this.currentWidth = w;
    this.currentHeight = h;

    this.app.renderer.resize(w, h);
    this.viewport.resize(w, h, Config.viewportWorldWidth, Config.viewportWorldHeight);

    this.app.renderer.render(this.app.stage);
    this.onZoomed();
    this.onMoved();
  }

  //-------------------------------------------
  // Key Events
  //-------------------------------------------
  private onKeyDown(prop: onKeyDownProp) {
    const event = prop.event;
    switch (event.key) {
      case 'ㅂ':
      case 'ㅃ':
      case 'q':
      case 'Q':
        this.switchMode(FloorplanerMode.MOVE);
        break;
      case 'ㅈ':
      case 'ㅉ':
      case 'w':
      case 'W':
        this.switchMode(FloorplanerMode.DRAW);
        break;
      case 'Escape':
        this.switchMode(FloorplanerMode.MOVE);
        break;
      case 'Shift':
        Config.snapToGrid = !Config.snapToGrid;
        break;
    }
  }
  private onKeyUp(prop: onKeyUpProp) {}

  //-------------------------------------------
  // Mouse Events
  //-------------------------------------------
  private onZoomed() {
    let zoom = this.viewport.scale.x;
    let bounds = Dimensioning.cmToPixel(Config.viewBounds); // * zoom;
    let maxZoomOut = Math.max(window.innerWidth, window.innerHeight) / bounds;
    zoom = zoom < maxZoomOut ? maxZoomOut : zoom > 60 ? 60 : zoom;

    this.viewport.scale.x = this.viewport.scale.y = zoom;
    this.tempWall2DHolder.scale.x = this.tempWall2DHolder.scale.y = zoom;

    this.grid2D.setGridScale(this.viewport.scale.x);
  }
  private onMoved() {
    let zoom = this.viewport.scale.x;
    let bounds = Dimensioning.cmToPixel(Config.viewBounds) * zoom;

    let xy = new Vector2(this.viewport.x, this.viewport.y);
    let topleft = new Vector2(-(bounds * 0.5), -(bounds * 0.5));
    let bottomright = new Vector2(bounds * 0.5, bounds * 0.5);

    let windowSize = new Vector2(this.currentWidth, this.currentHeight);

    let xValue = Math.min(-topleft.x, xy.x);
    let yValue = Math.min(-topleft.y, xy.y);

    xValue = Math.max(windowSize.x - bottomright.x, xValue);
    yValue = Math.max(windowSize.y - bottomright.y, yValue);

    this.viewport.x = xValue;
    this.viewport.y = yValue;
    this.tempWall2DHolder.x = xValue;
    this.tempWall2DHolder.y = yValue;
  }
  private onMouseDown(evt: FederatedPointerEvent) {
    if (IS_TOUCH_DEVICE) {
      this.onMouseUp(evt);
    }
  }
  private onMouseUp(evt: FederatedPointerEvent) {
    if (this.selected2D) {
      this.selected2D.selected = false;
    } else {
      if (this.mode === FloorplanerMode.DRAW) {
        let point = Dimensioning.eventToPoint(this.viewport, evt);
        const corner = this.floorplan.addCorner(point);
        if (this.lastCorner) {
          this.floorplan.addWall(this.lastCorner, corner);
        }
        this.lastCorner = corner;
      }
    }
  }
  private onMouseMove(evt: FederatedPointerEvent) {
    if (this.selected2D) {
      if (this.mode === FloorplanerMode.MOVE) {
        if (this.selected2D instanceof Corner2D) {
          this.selected2D.movePosition(evt);
        } else if (this.selected2D instanceof Wall2D) {
          // TODO : 상대적으로 움직인 좌표를 반영하도록 수정 필요
          this.selected2D.movePosition(evt);
        }
      }
    } else {
      if (this.mode === FloorplanerMode.DRAW) {
        let point = Dimensioning.eventToPoint(this.viewport, evt);

        if (this.lastCorner) {
          this.tempWall2D.update(this.lastCorner, point);
        } else {
          this.tempWall2D.update(undefined, undefined, point);
        }
      }
    }
  }

  //-------------------------------------------
  // Callback Events
  //-------------------------------------------
  private onSelected2DElement(prop: onSelected2DElementProp) {
    const target = prop.base2D;
    if (this.mode === FloorplanerMode.DRAW) {
      if (target instanceof Corner2D) {
        if (this.lastCorner) {
          this.floorplan.addWall(this.lastCorner, target.corner);
        }
        this.lastCorner = target.corner;
      } else if (target instanceof Wall2D) {
        console.log('selected Wall2D');
      }
    }
    this.viewport.plugins.pause('drag');
    this.selected2D = target;
  }
  private onUnselected2DElement(prop: onUnselected2DElementProp) {
    this.viewport.plugins.resume('drag');
    this.selected2D = undefined;
  }
  private onMouseDown2DWall(prop: onMouseDown2DWallProp) {
    if (this.mode === FloorplanerMode.DRAW) {
      // TODO: 2d Wall이 터치되진 않았지만, point가 2d wall 좌표라면 추가하도록 개선 필요.
      let point = Dimensioning.eventToPoint(this.viewport, prop.event);
      const corner = this.floorplan.addCorner(point);
      this.floorplan.addWall(corner, prop.wall2d.wall.end);

      prop.wall2d.setEnd(corner);
      if (this.lastCorner) {
        this.floorplan.addWall(this.lastCorner, corner);
      }
      this.lastCorner = corner;
    }
  }
  //-------------------------------------------
  // Functions
  //-------------------------------------------
  private drawCornerAndWall(corner: Corner) {
    if (this.lastCorner) {
      this.floorplan.addWall(this.lastCorner, corner);
    }
    this.lastCorner = corner;
  }
  private fitCenter() {
    let floorplanCenter = Vector3.Zero(); //this.__floorplan.getCenter();
    let zoom = this.viewport.scale.x;
    let windowSize = new Vector2(this.currentWidth, this.currentHeight);
    let bounds = Dimensioning.cmToPixel(Config.viewBounds) * zoom;
    let x = windowSize.x * 0.5 - floorplanCenter.x * 0.5; // - (bounds*0.5);
    let y = windowSize.y * 0.5 - floorplanCenter.z * 0.5; // - (bounds*0.5);
    this.viewport.x = x;
    this.viewport.y = y;
    this.tempWall2DHolder.x = x;
    this.tempWall2DHolder.y = y;
  }
  public switchMode(mode: FloorplanerMode) {
    let cursor: string;
    switch (mode) {
      case FloorplanerMode.MOVE:
        this.lastCorner = undefined;
        this.tempWall2D.visible = false;
        this.viewport.plugins.resume('drag');
        break;
      case FloorplanerMode.DRAW:
        this.tempWall2D.update();
        this.tempWall2D.visible = true;
        this.viewport.plugins.pause('drag');
        break;
      case FloorplanerMode.EDIT_ISLANDS:
        this.viewport.plugins.pause('drag');
        break;
    }
    this.mode = mode;
    ObservableManager.instance.onChangeMode.notifyObservers({
      mode: mode,
    });
  }
}
