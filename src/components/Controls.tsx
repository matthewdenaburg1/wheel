import React, { useState, useRef, useEffect } from 'react';
import NameList from './NameList';
import styles from './Controls.module.scss';
import { usePeople } from '../context/PeopleContext';
import { copyShareUrl } from '../utils/url';
import { ThemeControls } from '../utils/theme';

interface ControlsProps {
  themeControls: ThemeControls;
}

const Controls: React.FC<ControlsProps> = ({
  themeControls,
}) => {
  const { people, setPeople } = usePeople();
  const [name, setName] = useState('');
  const [isImportMode, setIsImportMode] = useState(false);
  const [importValue, setImportValue] = useState('');
  const nextId = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isImportMode && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [importValue, isImportMode]);

  const handleAddName = (name: string) => {
    const newPerson: Person = {
      id: nextId.current++,
      name,
      enabled: true,
    };

    setPeople([...people, newPerson]);
  };

  const handleShare = () => {
    copyShareUrl(people.map(p => p.name), themeControls.theme);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
    } else {
      if (name.trim()) {
        handleAddName(name.trim());
        setName('');
      }
    }
  };

  return (
    <div className={styles.controls}>
      <div className={styles.menu}>
        <button
          onClick={handleShare}
          className={styles.iconButton}
          title="Share"
        >
          <span className="fa fa-share"></span>
        </button>
        <button
          onClick={themeControls.toggleTheme}
          className={styles.iconButton}
          title="Toggle theme"
        >
          <span className="fa fa-lightbulb"></span>
        </button>
        <button
          onClick={() => setIsImportMode(!isImportMode)}
          className={styles.iconButton}
          title="Import"
        >
          <span className="fa fa-file-import"></span>
        </button>
      </div>

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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name"
          />
        )}
        <button
          type="submit"
          className={styles.addButton}
          aria-label="Add"
        >
          <span className="fa fa-regular fa-square-plus"></span>
        </button>
      </form>

      {!isImportMode && (
        <NameList />
      )}
    </div>
  );
};

export default Controls;
