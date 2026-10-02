import React, { useState, useRef, useEffect } from 'react';

import Settings from './Settings';
import NameList from './NameList';
import styles from '../styles/components/Controls.module.scss';

import { usePeople } from '../context/PeopleContext';

const Controls: React.FC = () => {
  const { people, setPeople } = usePeople();
  const [isImportMode, setIsImportMode] = useState<boolean>(false);
  const [importValue, setImportValue] = useState<string>('');
  const nextId = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isImportMode && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [importValue, isImportMode]);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isImportMode) {
      const names = importValue
        .split('\n')
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      if (names.length > 0) {
        nextId.current = 0;
        const newPeople = names.map((name) => ({
          id: nextId.current++,
          name,
          enabled: true,
        }));
        setPeople(newPeople);
        setImportValue('');
        setIsImportMode(false);
      }
    // } else { // TODO: ???
    //   const name = importValue.trim();
    //   if (name.trim()) {
    //     handleAddName(name.trim());
    //     setName('');
    //   }
    }
  };

  return (
    <div className={styles.controls}>
      <Settings />

      {/* name input form */}
      <form
        className={`${styles.nameInputForm} ${isImportMode ? styles.importMode : ''}`}
        onSubmit={handleSubmit}
      >
        {isImportMode ? (
          <textarea
            ref={textareaRef}
            className={styles.nameInput}
            value={importValue}
            onChange={(e) => setImportValue(e.target.value)}
            placeholder="Enter names, one per line"
            rows={1}
          />
        ) : (
          <input
            type="text"
            className={styles.nameInput}
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name"
          />
        )}
        <button
          type="submit"
          className={styles.addButton}
          aria-label="Add"
          title="Add"
        >
          <span className="fa fa-regular fa-square-plus"></span>
        </button>
      </form>

      <NameList />
    </div>
  );
};

export default Controls;
