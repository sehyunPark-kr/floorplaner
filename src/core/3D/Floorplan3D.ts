import { ObservableManager } from '../Manager/ObservableManager';

import type { onUpdateFloorplanProp } from '../Manager/ObservableManager';
import type { ZED3D } from '../ZED3D';

export class Floorplan3D {
  public constructor(private zed3D: ZED3D) {
    ObservableManager.instance.onUpdateFloorplan.add((prop) => this.updateFloorplan(prop));
  }
  public dispose() {}

  private updateFloorplan(prop: onUpdateFloorplanProp) {
    //
  }
}
