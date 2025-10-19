import $ from "jquery";
import Person from "./person";
import { wheelSync } from "./wheel_event";

class PersonList {
  private _people: Person[] = [];
  private static _instance: PersonList;

  constructor(...people: Person[]) {
    if (PersonList._instance) {
      return PersonList._instance;
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

  /** the names of all enabled people */
  public get names(): string[] {
    return this.enabled.map(person => person.name);
  }

  public get allNames(): string[] {
    return this.people.map(person => person.name);
  }

  /** the number of enabled people */
  public get count(): number {
    return this.enabled.length;
  }

  public get fullCount(): number {
    return this.people.length;
  }

  public add(person: Person): void {
    this.people.push(person);
    this.render();
  }

  public remove = (person: Person): void => {
    const index = this.people
      .map((person) => person.id)
      .indexOf(person.id);

    this.people.splice(index, 1);
    this.render();
  }

  public render = (): void => {
    const $peopleList = $("#people-list");
    $peopleList.empty();
    this.people.forEach(person => {
      $peopleList.append(person.toHTML());
    });
    this.syncWheel();
  }

  public fromNames(names: string[]): this {
    this._people = names.map(name => new Person(name));

    return this;
  }

  public getNextWinner(): { person: Person, count: number, index: number } {
    const count = this.count;
    const index = Math.floor(Math.random() * count);
    const person = this.people[index];
    person.isCurrentWinner = true;

    return { person, count, index };
  }

  private syncWheel(): void {
    wheelSync.sync();
  }
}

const personList = new PersonList();

export { personList, PersonList };
