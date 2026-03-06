import React from 'react';
import styles from './NameList.module.scss';
import { Person } from './App';

interface NameListProps {
  people: Person[];
  onRemoveName: (id: number) => void;
  onToggleEnabled: (id: number) => void;
}

const NameList: React.FC<NameListProps> = ({ people, onRemoveName, onToggleEnabled }) => {
  return (
    <div className={styles.nameList}>
      {people.map((person) => (
        <div
          key={person.id}
          className={`${styles.person} ${!person.enabled ? styles.disabled : ''}`}
        >
          <input
            type="checkbox"
            checked={person.enabled}
            onChange={() => onToggleEnabled(person.id)}
            className={styles.checkbox}
          />
          <span className={styles.name}>{person.name}</span>
          <button
            className={styles.removeButton}
            onClick={() => onRemoveName(person.id)}
          >
            <span className="fa fa-regular fa-trash-can"></span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NameList;
