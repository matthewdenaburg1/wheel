import $ from "jquery";
import { wheelSync } from './wheel_event';

class PersonEventTarget extends EventTarget {
  protected _enabled: boolean = true;
  protected _cssId: string = '';

  constructor() {
    super();
  }

  public edit(): boolean {
    return false;
  }

  public save(): boolean {
    return false;
  }

  public disable(): void {
    if (this._enabled) {
      return;
    }
    this._enabled = false;

    const $element = $(`#${this._cssId}`);
    $element.toggleClass('disabled', true);
    $element.find('.buttons .icon').toggleClass('hover', false);

    wheelSync.sync();
  }

  public enable(): void {
    if (this._enabled) {
      return;
    }
    this._enabled = true;

    const $element = $(`#${this._cssId}`);
    $element.toggleClass('disabled', false);
    $element.find('.buttons .icon').toggleClass('hover', true);

    wheelSync.sync();
  }
}

export { PersonEventTarget };

