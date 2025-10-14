import $ from "jquery";
import Angle from "./angle";
import Color from "./color";
import Person from "./person";

class Sector {
  private static count: number = 0;
  private _initialAngle: Angle = new Angle(0);
  private _finalAngle: Angle = new Angle(0);
  private _backgroundColor: Color;
  private _radius: number = 0;
  private _text: string = '';
  private _person: Person;

  /**
   * @param colorAngle the angle this Sector is oriented to.
   */
  constructor(colorAngle: number, text: string, person?: Person) {
    this._backgroundColor = new Color(`hsl(${Math.floor(colorAngle)}, 100%, 45%)`);
    this._person = person || new Person(text);
    this._text = this._person.name;
  }

  private toPolarPoint(angle: Angle): string {
    let x: number = this._radius + this._radius * Math.cos(angle.radians);
    let y: number = this._radius + this._radius * Math.sin(angle.radians);

    // divide by 2 since we're starting from the center
    x /= 2;
    y /= 2;

    // to 3 decimal places
    x = Math.round(x * 1000) / 1000;
    y = Math.round(y * 1000) / 1000;

    return this.convertPointToString({ x, y });
  }

  private convertPointToString(point: { x: number, y: number }): string {
    return `${point.x} ${point.y}`;
  }

  get clipPath(): string {
    // center of the circle
    const center = this.convertPointToString({ x: this._radius / 2, y: this._radius / 2} );
    // start point of the arc
    const radiusPoint = this.toPolarPoint(this._initialAngle);
    // end point of the arc
    const arcPoint = this.toPolarPoint(this._finalAngle);

    const arc = [
      center,
      this._initialAngle.degrees,
      this._finalAngle.degrees > 180 ? 1 : 0, // large-arc flag
      1,
      arcPoint
    ].join(' ');

    const path = [
      `M ${center}`, // move to center
      `L ${radiusPoint}`, // line to start point
      `A ${arc}`, // arc to end point
      'Z' // close path
    ].join(' ')

    return `path("${path}")`;
  }

  toHtml(): JQuery<HTMLElement> {
    const $slice = $('<div>')
      .addClass('slice')
      .css({
        backgroundColor: this._backgroundColor.toString(),
        clipPath: this.clipPath,
      });

    const finalAngle = Sector.count > 1 ? this._finalAngle.degrees : 0;

    const $text = $('<div>')
      .addClass('name')
      .addClass(this._backgroundColor.isDark ? 'dark' : 'light')
      .text(this._text)
      .css({
        top: `calc(50% - ${this.chord / 4}px + 1rem)`,
        height: `${this.chord / 2}px`,

        // counteract the rotation of the sector when it's added to the wheel
        transform: `rotate(${finalAngle / 2}deg)`,
        transformOrigin: 'left'
      });

    $slice.append($text);
    return $slice;
  }

  get text(): string {
    return this._text;
  }

  get finalAngle(): Angle {
    return this._finalAngle;
  }

  /**
   * A chord of a circle is a straight line segment whose endpoints both lie on a circular arc.
   * @see https://en.wikipedia.org/wiki/Chord_(geometry)
   */
  get chord(): number {
    if (Sector.count <= 1) {
      return this._radius;
    }

    return this._radius * Math.sin(this._finalAngle.radians / 2);
  }

  set finalAngle(newAngle: number) {
    this._finalAngle = new Angle(newAngle);
  }

  get radius(): number {
    return this._radius;
  }

  set radius(newRadius: number) {
    this._radius = newRadius;
  }

  static setCount(count: number): void {
    Sector.count = count;
  }
}

export default Sector;
