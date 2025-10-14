import $ from "jquery";
import Wheel from "./wheel";

class Person {
  private _enabled: boolean = true;
  private _name: string = '';
  private _id: number;
  private _cssId: string;

  private static _currentId: number = 0;
  private static _people: Person[] = [];

  constructor(name: string) {
    if (name === null) {
      throw new Error('Name cannot be null');
    }

    this._id = Person._currentId++;
    this._cssId = `person-${this._id}`;
    this.name = name;
  }

  public get name(): string {
    return this._name;
  }

  public get id(): number {
    return this._id;
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public set name(name: string) {
    this._name = name;

    // if there is a name, add to the list of people.
    // This prevents blank names from being added to the wheel.
    if (this.name.length > 0) {
      Person._people.push(this);
    }
  }

  public set enabled(enabled: boolean) {
    // return if not different
    if (this.enabled === enabled) {
      return;
    }

    // update
    this._enabled = enabled;

    const $element = $(`#${this._cssId}`);
    // add `disabled` if the person is
    $element.toggleClass('disabled', this.enabled === false);
    // and if they ARE enabled, turn the hover functinoality on the buttons on
    $element.find('.buttons .icon').toggleClass('hover', this.enabled === true);

    Wheel.self.names = Person.getNames();
  }


  public toString(): string {
    return this._name;
  }

  private getItemNameElement(): JQuery<HTMLElement> {
    return $('<div>')
      .addClass('item name hover')
      .append($(`<span class="icon">${this._name}</span>`))
      .on('click', () => { this.enabled = !this.enabled; });
  }

  public toHTML(): JQuery<HTMLElement> {
    const $row = $("<div>").addClass('row person').attr('id', this._cssId);
    const $buttons = $(`<div class="item buttons">
      <span class="icon hover remove fa fa-trash" title="Remove"></span>
      <span class="icon hover edit fa fa-edit" title="Edit"></span>
    </div>`);

    const $itemName = this.getItemNameElement();

    $buttons.find('.edit').on('click', () => this.edit());
    $buttons.find('.remove').on('click', () => this.remove());

    $row.append($buttons).append($itemName);

    return $row;
  }

  private edit(): void {
    if (this.enabled === false) {
      return;
    }

    const onSave = (name: string, $input: JQuery<HTMLElement>) => {
      this.name = name;
      $input.replaceWith(this.getItemNameElement());
    };
    this.renderNameInputElement('edit', onSave);
  }

  private add(): void {
    const onSave = (name: string, $input: JQuery<HTMLElement>) => {
      this.name = name;
      $input.replaceWith(this.toHTML());
    }
    const $input = this.renderNameInputElement('add', onSave);
    $('#people-list').append($input);
    $input.trigger('focus');
  }

  private remove(): void {
    if (this.enabled === false) {
      return;
    }

    $(`#${this._cssId}`).remove();
  }

  private renderNameInputElement(type: string, onSave: (name: string, $input: JQuery<HTMLElement>) => void): JQuery<HTMLElement> {
    if (['edit', 'add'].includes(type) === false) {
      throw new Error('Invalid type for renderNameInputElement');
    }

    let cssClass: string = 'name-input',
        placeholder: string = 'Name',
        value: string = '';

    if (type === 'edit') {
      cssClass = 'name-edit';
      value = this.name;
    }

    const $input = $('<input />')
      .addClass(cssClass)
      .attr({
        'type': 'text',
        'id': `person-input-${this.id}`,
        'data-person-id': this.id,
        'placeholder': placeholder,
      })
      .val(value);

    const handleSave = (event: JQuery.TriggeredEvent) => {
      if (event.type === 'keypress' && event.key !== 'Enter') {
        return;
      }
      $input.off('keypress blur');

      const name = ($input.val() as string || '').trim();

      if (name.length > 0) {
        onSave(name, $input);
        Wheel.self.names = Person.getNames();
      } else {
        if (type === 'edit') {
          $input.replaceWith(this.getItemNameElement());
        } else {
          $input.remove();
        }
      }
    };

    $input.on('keypress', handleSave).on('blur', handleSave);

    if (type === 'edit') {
      const $itemName = $(`#${this._cssId} .item.name`);
      $itemName.replaceWith($input);
      $input.trigger('focus');
    }

    return $input;
  }

  public static newPerson(): void {
    new Person('').add();
  }

  public static renderAll(): void {
    const $peopleList = $('#people-list');
    Person._people.forEach(person => {
      $peopleList.append(person.toHTML());
    });
  }

  public static getPeople(): Person[] {
    return Person._people
      .filter(person => person.enabled === true);
  }

  public static getNames(): string[] {
    return Person.getPeople().map(person => person.name);
  }

  public static fromNames(names: string[]): Person[] {
    return names.map(name => new Person(name));
  }
};

export default Person;
