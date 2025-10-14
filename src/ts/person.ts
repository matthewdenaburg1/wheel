import $ from "jquery";
import Wheel from "./wheel";
import PersonList from "./person_list";

class Person {
  private _enabled: boolean = true;
  private _name: string = '';
  private _id: number;
  private _cssId: string;

  private static _currentId: number = 0;

  constructor(name: string) {
    if (name === null) {
      throw new Error('Name cannot be null');
    }

    this._name = name;
    this._id = Person._currentId++;
    this._cssId = `person-${this._id}`;
  }

  public get name(): string {
    return this._name;
  }

  public get id(): number {
    return this._id;
  }

  public get cssId(): string {
    return this._cssId;
  }

  public get enabled(): boolean {
    return this._enabled;
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

    Wheel.self.names = Person.names;
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

    $buttons.find('.edit').on('click', this.edit);
    $buttons.find('.remove').on('click', () => PersonList.instance.remove(this));

    $row.append($buttons).append($itemName);

    return $row;
  }

  private edit = (): void => {
    if (this.enabled === false) {
      return;
    }

    const $input = $('<input />')
      .addClass('name-edit')
      .attr({'type': 'text', 'placeholder': 'New name'})
      .val(this.name);

    const handleSave = (event: JQuery.TriggeredEvent) => {
      if (event.type === 'keypress' && event.key !== 'Enter') {
        return;
      }
      $input.off('keypress blur');

      const name = ($input.val() as string || '').trim();

      if (name.length > 0 && name) {
        this._name = name;

        $input.replaceWith(this.getItemNameElement());
        Wheel.self.names = PersonList.instance.names;
      } else {
        // if no input, revert back to what it was
        $input.replaceWith(this.getItemNameElement());
      }
    };

    $input.on('keypress', handleSave).on('blur', handleSave);

    const $itemName = $(`#${this._cssId} .item.name`);
    $itemName.replaceWith($input);
    $input.trigger('focus');
  }

  public static get people(): PersonList {
    return PersonList.instance;
  }

  public static get names(): string[] {
    return Person.people.names;
  }
};

export default Person;
