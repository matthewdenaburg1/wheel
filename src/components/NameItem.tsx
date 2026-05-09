import React from 'react';
import styles from './NameList.module.scss';
import { usePeople } from '../context/PeopleContext';

interface NameProps {
  person: Person;
}

const NameItem: React.FC<NameProps> = ({ person }) => {
  const { people, setPeople } = usePeople();

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
        className={styles.button}
        title="Remove"
        type="button"
        onClick={() => handleRemoveName(person.id)}
      >
        <span className="fa fa-regular fa-trash-can"></span>
      </button>

    </div>
  );
};

export default NameItem;
