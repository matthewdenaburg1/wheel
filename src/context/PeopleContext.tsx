import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

export type People = Person[];

interface PeopleContextValue {
  people: People;
  setPeople: Dispatch<SetStateAction<People>>;
}

const PeopleContext = createContext<PeopleContextValue>({
  people: [],
  setPeople: () => {},
});

export const usePeople = () => useContext(PeopleContext);
export const usePeopleState = (): [People, Dispatch<SetStateAction<People>>] => {
  return useState<People>([]);
};

export { PeopleContext };
