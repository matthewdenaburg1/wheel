import { createContext, useContext, useRef, useState, Dispatch, SetStateAction } from 'react';

export type People = Person[];

interface PeopleContextValue {
  people: People;
  setPeople: Dispatch<SetStateAction<People>>;
}

export const PeopleContext = createContext<PeopleContextValue>({
  people: [],
  setPeople: () => {},
});

export const usePeople = () => useContext(PeopleContext);
export const usePeopleState = (): [People, Dispatch<SetStateAction<People>>] => {
  return useState<People>([]);
};

const nextId = useRef(0);

const [people, setPeople] = usePeopleState();

export const newPerson = (name: string = '') => {
  const person: Person = {
    id: nextId.current++,
    name,
    enabled: true,
  };

  setPeople([...people, person]);
};

