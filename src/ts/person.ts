import $ from "jquery";

class Person {
  private _enabled: boolean = true;
  private _name: string;
  private _id: number;
  private _cssId: string;

  private static _currentId: number = 0;
  private static _people: Person[] = [];

  constructor(name: string) {
    this._name = name;
    this._id = Person._currentId++;
    this._cssId = `person-${this._id}`;

    Person._people.push(this);
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
  }

  public toString(): string {
    return this._name;
  }

  public render(): JQuery<HTMLElement> {
    const $row = $(`
      <div class="row person" id="${this._cssId}">
        <div class="item buttons">
          <span class="icon hover remove fa fa-trash" title="Remove"></span>
          <span class="icon hover edit fa fa-edit" title="Edit"></span>
        </div>
        <div class="item name hover">
          <span class="icon">${this._name}</span>
        </div>
      </div>
    `);

    $row.find('.name').on('click', () => this.toggleName());
    $row.find('.remove').on('click', () => this.removeName());

    return $row;
  }

  private toggleName(): void {
    this._enabled = !this._enabled;
    $(`#${this._cssId}`).toggleClass('disabled', !this._enabled);
    $(`#${this._cssId} .buttons .icon`).toggleClass('hover', this._enabled);
  }

  private removeName(): void {
    $(`#${this._cssId}`).remove();
  }

  public static getNames(): string[] {
    return Person._people.map(person => person.name);
  }

  public static showNewPersonInput(): void {
    const newId = Person._currentId++;
    const $input = $('<input />')
      .addClass('name-input')
      .attr({
        'type': 'text',
        'id': `new-person-input-${newId}`,
        'data-person-id': newId,
        'placeholder': 'New name',
      });

    $input.on('keypress', (e) => {
      if (e.key === 'Enter') {
        const name = ($input.val() as string || '').trim();
        if (name.length > 0) {
          Person.savePerson(newId);
        }
      }
    });

    $('#people-list').append($('<div class="row">').append($input));
    $input.focus();
  }

  public static renderAll(): void {
    const $peopleList = $('#people-list');
    Person._people.forEach(person => {
      $peopleList.append(person.render());
    });
  }

  private static savePerson(newId: number): void {
    const $input = $(`#new-person-input-${newId}`);
    const name = ($input.val() as string || '').trim();

    if (name.length > 0) {
      const person = new Person(name);
      const $lastRow = $('#people-list .row.person').last();
      $lastRow.after(person.render());
      $input.remove();
    }
  }
};

export default Person;
