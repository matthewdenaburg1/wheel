import React from 'react';
import styles from './NameList.module.scss';
import { usePeople } from '../context/PeopleContext';
import NameItem from './NameItem';

const NameList: React.FC = () => {
  const { people } = usePeople();

  return (
    <div className={styles.nameList}>
      {people.map((person) => (
        <NameItem
          key={person.id}
          person={person}
        />
      ))}
    </div>
  );
};

export default NameList;
