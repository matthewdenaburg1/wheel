import React, { useState, useEffect, useRef } from 'react';
import styles from './NameList.module.scss';
import { usePeople } from '../context/PeopleContext';

const NameList: React.FC = () => {
  const { people, setPeople } = usePeople();
  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      // Show indicator if there is scrollable content below (threshold of 8px)
      setCanScrollDown(scrollHeight - (scrollTop + clientHeight) > 8);
    }
  };

  useEffect(() => {
    checkScroll();
    const listEl = listRef.current;
    if (listEl) {
      listEl.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (listEl) {
        listEl.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [people]);

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

  return (
    <div className={styles.nameListWrapper}>
      <div className={styles.nameList} ref={listRef}>
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
            <button
              className={styles.button}
              onClick={() => handleRemoveName(person.id)}
            >
              <span className="fa fa-regular fa-trash-can"></span>
            </button>
          </div>
        ))}
      </div>
      {canScrollDown && (
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span className="fa fa-chevron-down"></span>
        </div>
      )}
    </div>
  );
};

export default NameList;
