import React, { useState, useEffect, useRef } from 'react';
import styles from './NameList.module.scss';
import { usePeople } from '../context/PeopleContext';
import { useAppMode } from '../context/AppModeContext';

const NameList: React.FC = () => {
  const { people, setPeople } = usePeople();
  const { mode } = useAppMode();
  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const sortedPeople =
    mode === 'round-robin'
      ? [
          ...people
            .filter((p) => p.order !== undefined)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
          ...people.filter((p) => p.order === undefined),
        ]
      : people;

  const checkScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
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
  }, [people, mode]);

  const handleRemoveName = (id: number) => {
    const person = people.find((p) => p.id === id);
    if (person && person.enabled && person.order === undefined) {
      setPeople(people.filter((p) => p.id !== id));
    }
  };

  const handleToggleEnabled = (id: number) => {
    if (mode === 'round-robin') {
      const person = people.find((p) => p.id === id);
      if (person?.order !== undefined) return; // locked, ignore
    }
    setPeople(people.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  return (
    <div className={styles.nameListWrapper}>
      <div
        className={`${styles.nameList} ${mode === 'round-robin' ? styles.roundRobin : ''}`}
        ref={listRef}
      >
        {sortedPeople.map((person) => {
          const isLocked = mode === 'round-robin' && person.order !== undefined;
          return (
            <div
              key={person.id}
              className={`${styles.person} ${!person.enabled ? styles.disabled : ''} ${isLocked ? styles.locked : ''}`}
            >
              {isLocked && <span className={styles.orderBadge}>#{person.order}</span>}
              <label
                id={`checkbox-${person.id}`}
                className={[styles.name, styles.button].join(' ')}
                onClick={() => (isLocked ? undefined : handleToggleEnabled(person.id))}
              >
                {person.name}
              </label>
              {isLocked ? (
                <span
                  className={`${styles.button} ${styles.lockIcon}`}
                  aria-label="Locked"
                >
                  <span className="fa fa-lock"></span>
                </span>
              ) : (
                <button
                  className={styles.button}
                  onClick={() => handleRemoveName(person.id)}
                >
                  <span className="fa fa-regular fa-trash-can"></span>
                </button>
              )}
            </div>
          );
        })}
      </div>
      {canScrollDown && (
        <div
          className={styles.scrollIndicator}
          aria-hidden="true"
        >
          <span className="fa fa-chevron-down"></span>
        </div>
      )}
    </div>
  );
};

export default NameList;
