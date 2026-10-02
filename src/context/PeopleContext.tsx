import { createContext, useContext, useState, useRef, Dispatch, SetStateAction, RefObject } from 'react';

type PersonOrName = Person | string;

export class PeopleContextController {
  private nextIdRef: RefObject<number>;
  private _people: Person[] = [];
  private setPeopleState: Dispatch<SetStateAction<Person[]>>;

  constructor(
    people: PersonOrName[] = [],
    setPeople: Dispatch<SetStateAction<Person[]>>,
    nextIdRef: RefObject<number>
  ) {
    this.setPeopleState = setPeople;
    this.nextIdRef = nextIdRef;
    this._internalSetPeople = people.map((p) => this.new(p));
  }

  get people(): Person[] {
    return [...this._people];
  }

  set people(newValues: string[]) {
    this._internalSetPeople = newValues.map((name) => this.new(name));
  }

  getPerson = (id: number): Person | undefined => {
    return this._people.find((p) => p.id === id);
  }

  private set _internalSetPeople(newPeople: Person[]) {
    this._people = shuffle(newPeople);
    this.setPeopleState([...this._people]);
  }

  private new = (value: PersonOrName): Person => {
    if (typeof value === 'string') {
      if (this.nextIdRef.current !== null) {
        this.nextIdRef.current += 1;
      }
      return {
        id: this.nextIdRef.current ?? 1,
        name: value,
        enabled: true,
      };
    }

    // Sync nextId to prevent future collisions with passed-in IDs
    if (this.nextIdRef.current !== null && value.id > this.nextIdRef.current) {
      this.nextIdRef.current = value.id;
    }

    return value;
  }

  addPerson = (name: string) => {
    this._internalSetPeople = [...this.people, this.new(name)];
  }

  removePerson = (id: number) => {
    this._internalSetPeople = this._people.filter((p) => p.id !== id);
  }

  shufflePeople = () => {
    this._internalSetPeople = [...this.people];
  }
}

const shuffle = (array: any[]): any[] => {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

interface PeopleContextType {
  actions: PeopleContextController | null;
}

const PeopleContext = createContext<PeopleContextType>({ actions: null });

export const PeopleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);

  const nextIdRef = useRef<number>(0);

  // Instantiate the controller with the live state and dispatcher
  const controller = new PeopleContextController(people, setPeople, nextIdRef);

  // Pass it cleanly down the context value object
  const contextValue: PeopleContextType = {
    actions: controller,
  };

  return (
    <PeopleContext.Provider value={contextValue}>
      {children}
    </PeopleContext.Provider>
  );
};

export const usePeople = () => {
  const context = useContext(PeopleContext);
  if (!context || !context.actions) {
    throw new Error('usePeople must be used within a PeopleProvider');
  }
  return context.actions;
};
