import $ from "jquery";
import Person from "./person";
import { wheelSync } from './wheel_sync_event';

class PersonList {
  private _people: Person[] = [];
  private static _instance: PersonList;

  constructor(...people: Person[]) {
    if (PersonList.instance) {
      return PersonList.instance;
    }

    this._people = people || [];
    PersonList._instance = this;
  }

  public get people(): Person[] {
    return this._people;
  }

  public get enabled(): Person[] {
    return this.people.filter(person => person.enabled === true);
  }

  public get names(): string[] {
    return this.enabled.map(person => person.name);
  }

  /** the number of enabled people */
  public get count(): number {
    return this.enabled.length;
  }

  public add = (): void => {
    const $input = $('<input />')
      .addClass('add')
      .attr({'type': 'text', 'placeholder': 'New name'});

    const handleSave = (event: JQuery.TriggeredEvent) => {
      if (event.type === 'keypress' && event.key !== 'Enter') {
        return;
      }
      $input.off('keypress blur');

      const name = ($input.val() as string || '').trim();

      if (name.length > 0) {
        // if there is input, add the person
        const person = new Person(name);
        this.people.push(person);

        $input.replaceWith(person.toHTML());
        wheelSync.dispatch();
      } else {
        // no input, so abort
        $input.remove();
      }
    };

    $input.on('keypress', handleSave).on('blur', handleSave);
    $('#people-list').append($input);
    $input.trigger('focus');
  }

  public remove = (target?: Person, targetId?: number): void => {
    if (!target && !targetId) {
      return;
    }
    let person: Person;

    if (target) {
      person = target;
    }
    else if (targetId) {
      person = this.people.find(person => person.id === targetId);
    }

    if (!personId) {
      return;
    }

    if (person && person.enabled === false) {
      return;
    }
    const id = personId;

    const index = this.people
      .map((person) => person.id)
      .indexOf(person.id);

    this.people.splice(index, 1);
    this.render();
    wheelSync.dispatch();
  }

  public render = (): void => {
    const $peopleList = $('#people-list');
    $peopleList.empty();
    this.people.forEach(person => {
      $peopleList.append(person.toHTML());
    });
  }

  public static get instance(): PersonList {
    return PersonList._instance;
  }

  public static fromNames(names: string[]): PersonList {
    return new PersonList(...names.map(name => new Person(name)));
  }

  public static count(): number {
    return PersonList.instance.count;
  }
}

export default PersonList;
