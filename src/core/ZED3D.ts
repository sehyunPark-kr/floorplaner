import {
  ArcRotateCamera,
  Color3,
  Color4,
  DirectionalLight,
  Engine,
  HemisphericLight,
  MeshBuilder,
  PBRMaterial,
  PointerEventTypes,
  Scene,
  Vector3,
} from '@babylonjs/core';

import { Floorplan3D } from './3D/Floorplan3D';

export class ZED3D {
  //-------------------------------------------------
  // * Core Member
  private engine!: Engine;
  public scene!: Scene;
  public camera!: ArcRotateCamera;
  public light!: DirectionalLight;

  private floorplan3D!: Floorplan3D;

  //-------------------------------------------
  public constructor(private canvas: HTMLCanvasElement) {
    this.initialize();
  }
  private initialize() {
    // * Core Member 초기화
    this.engine = new Engine(this.canvas, true, {
      adaptToDeviceRatio: true,
    });
    this.engine.disableUniformBuffers = true;
    this.scene = new Scene(this.engine);

    // * Scene 초기화
    this.scene.clearColor = new Color4(0, 0, 0, 0);
    this.scene.autoClear = false;
    this.scene.autoClearDepthAndStencil = false;
    this.scene.skipFrustumClipping = true;
    this.scene.skipPointerMovePicking = true;
    this.scene.blockMaterialDirtyMechanism = true;
    this.scene.getEngine().stopRenderLoop();
    this.scene.getEngine().runRenderLoop(() => {
      this.scene.render();
    });

    new ResizeObserver((entries) => {
      this.engine.resize();
    }).observe(this.canvas);

    this.scene.createDefaultCamera(true, false, true);
    this.camera = this.scene.activeCamera as ArcRotateCamera;
    this.camera.fov = 30;
    this.camera.position = new Vector3(0, 15, 0);

    this.light = new DirectionalLight('light', new Vector3(0, -1, 0), this.scene);

    // const ground = MeshBuilder.CreateBox('ground', undefined, this.scene);
    // ground.scaling = new Vector3(5, 0.2, 5);
    // ground.position = new Vector3(0, -0.1, 0);
    // const groundMat = new PBRMaterial('ground');
    // groundMat.unlit = true;
    // groundMat.albedoColor = Color3.Black();
    // ground.material = groundMat;

    this.floorplan3D = new Floorplan3D(this);
  }
  public dispose() {
    this.floorplan3D.dispose();
    this.scene.dispose();
    this.engine.dispose();
  }
}
