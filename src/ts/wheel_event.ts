class WheelEvent extends EventTarget {
  private static _instance: WheelEvent;

  constructor() {
    super();

    if (WheelEvent._instance) {
      return WheelEvent._instance;
    }
    WheelEvent._instance = this;
  }

  public sync(): boolean {
    return this.dispatchEvent(new Event('wheel-sync'));
  }
}

const wheelSync = new WheelEvent();

class WheelSyncEvent extends Event {
  constructor() {
    super('wheel-sync');
  }
}

export { wheelSync, WheelSyncEvent };
