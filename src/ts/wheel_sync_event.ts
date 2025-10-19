class WheelSync extends EventTarget {
  private static _instance: WheelSync;

  constructor() {
    super();

    if (WheelSync._instance) {
      return WheelSync._instance;
    }
    WheelSync._instance = this;
  }

  public dispatch(): boolean {
    return this.dispatchEvent(new WheelSyncEvent());
  }

  public static get instance(): WheelSync {
    if (!WheelSync._instance) {
      new WheelSync();
    }
    return WheelSync._instance;
  }
}

const wheelSync = new WheelSync();

class WheelSyncEvent extends Event {
  constructor() {
    super('wheel-sync');
  }
}

export { wheelSync, WheelSyncEvent };
