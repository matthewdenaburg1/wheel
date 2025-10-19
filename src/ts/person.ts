import $ from "jquery";
import { personList } from "./person_list";

class Person {
  private _name: string;
  private _id: number;
  private _cssId: string;
  private _enabled: boolean;
  private _isBeingEdited: boolean;
  private _isNew: boolean;

  isCurrentWinner: boolean;

  private static _currentId: number = 0;

  constructor(name: string) {
    if (name === null) {
      throw new Error('A Name is required');
    }

    this._name = name;
    this._id = Person._currentId++;
    this._cssId = `person-${this._id}`;
    this._enabled = true;
    this._isNew = false;
    this._isBeingEdited = false;
    this.isCurrentWinner = false;
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

  public set enabled(value: boolean) {
    if (this.enabled === value) {
      return;
    }

    this._enabled = value;
    this.syncEnabledStatus();
  }

  public toString(): string {
    return this._name;
  }

  public toHTML(): JQuery<HTMLElement> {
    const $row = $("<div>")
      .addClass(`row person ${this.enabled ? "" : "disabled"}`)
      .attr('id', this._cssId);

    // TODO: does this **need** to be a div of spans?
    const $buttons = $(`<div class="item buttons">
      <span class="icon hover remove fa fa-trash" title="Remove"></span>
      <span class="icon hover edit fa fa-edit" title="Edit"></span>
      </div>`);
    $buttons.find('.edit').on('click', this.edit.bind(this));
    $buttons.find('.remove').on('click', this.remove.bind(this));

    const $nameDiv = $("<div class='item name'>")
      .append($("<span class='icon'>").text(this._name))
      .on('click', () => { this.enabled = !this.enabled; } );// this.toggle.bind(this));

    const $input = $(`<input id="${this._cssId}-input" class='name-input name-edit' type='text' placeholder='New name' />`)
      .hide()
      .on('keypress blur', this.save.bind(this));

    $row.append($buttons, $nameDiv, $input);

    return $row;
  }

  private syncEnabledStatus = (): void => {
    const $person = $(`#${this._cssId}`);
    // add `disabled` if the person is disabled
    $person.toggleClass("disabled", !this.enabled);

    personList.render();
  }

  private remove = (): void => {
    if (!this.enabled) {
      return;
    }
    if (this._isBeingEdited) {
      return;
    }

    personList.remove(this);
  }

  private edit = (): void => {
    if (!this.enabled) {
      return;
    }
    this._isBeingEdited = true;

    const $this = $(`#${this._cssId}`);
    $this.find('.item.name').toggle();
    $this.find('input.name-input').val(this.name).toggle().trigger('focus');
  }

  private save = (event: JQuery.TriggeredEvent): void => {
    if (!this._isBeingEdited) {
      return;
    }
    if (event.type !== 'keypress' && event.type !== 'blur') {
      return;
    }
    if  (event.type === 'keypress' && event.key !== 'Enter') {
      return;
    }

    const $person = $(`#${this._cssId}`);
    const $input = $person.find('.name-input')

    const name = ($input.val() as string || '').trim();
    if (name && name.length > 0) {
      this._name = name;
      $person.find('.item.name .icon').text(this._name);

      if (this._isNew) {
        this._isNew = false;
        personList.add(this);
      }
    }

    $input.toggle().removeClass('edit');
    this._isBeingEdited = false;
    $person.find('.item.name').toggle();
    personList.render();
  }

  static add(): void {
    const newPerson = new Person("");
    newPerson._isNew = true;
    const $person = newPerson.toHTML()

    $("#people-list").append($person);
    newPerson.edit();
  }
};

export default Person;
