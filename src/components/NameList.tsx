import React from 'react';
import styles from './NameList.module.scss';
import { Person } from '../App';

interface NameListProps {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
}

const NameList: React.FC<NameListProps> = ({ people, setPeople }) => {
  const handleRemoveName = (id: number) => {
    const person = people.find((person) => person.id === id);

    if (person && person.enabled) {
      setPeople(people.filter((person) => person.id !== id));
    }
  };

  const handleToggleEnabled = (id: number) => {
    setPeople(
      people.map((person) =>
        person.id === id ? { ...person, enabled: !person.enabled } : person
      )
    );
  };

  // const handleEditName = (person: Person) => {
  // };

  return (
    <div className={styles.nameList}>
      {people.map((person) => (
        <div
          key={person.id}
          className={`${styles.person} ${!person.enabled ? styles.disabled : ''}`}
        >
          <label
            id={`checkbox-${person.id}`}
            className={[styles.name, styles.button].join(' ')}
            onClick={() => handleToggleEnabled(person.id)}
          >
            {person.name}
          </label>
          {/* <button
            onClick={() => handleEditName(person)}
          >
            <span className="fa fa-regular fa-edit"></span>
          </button> */}
          <button
            onClick={() => handleRemoveName(person.id)}
          >
            <span className="fa fa-regular fa-trash-can"></span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NameList;
