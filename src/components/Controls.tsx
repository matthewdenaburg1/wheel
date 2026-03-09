import React, { useState, useRef, useEffect } from 'react';
import NameList from './NameList';
import styles from './Controls.module.scss';
import { shareUrl } from '../utils/url';
import { Person } from '../App';

interface ControlsProps {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  onToggleTheme: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  people,
  setPeople,
  onToggleTheme,
}) => {
  const [name, setName] = useState('');
  const [isImportMode, setIsImportMode] = useState(false);
  const nextId = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isImportMode && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [name, isImportMode]);

  const handleAddName = (name: string) => {
    const newPerson: Person = {
      id: nextId.current++,
      name,
      enabled: true,
    };

    setPeople([...people, newPerson]);
  };

  const handleImportNames = (rawNames: string) => {
    const names = rawNames.split('\n').map(n => n.trim()).filter(n => n !== '');
    nextId.current = 0;
    const newPeople = names.map(name => ({
      id: nextId.current++,
      name,
      enabled: true,
    }));
    setPeople(newPeople);
  };

  const handleShare = () => {
    shareUrl(people.map(p => p.name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim()) {
      if (isImportMode) {
        handleImportNames(name);
        setIsImportMode(false);
      } else {
        handleAddName(name.trim());
      }
      setName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isImportMode && e.key === 'Enter') {
      // In import mode, we want Enter to add a newline, not submit the form
      // Textarea does this by default, but we'll stop propagation just in case
      e.stopPropagation();
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
          onClick={() => setIsImportMode(!isImportMode)}
          className={`${styles.iconButton} ${isImportMode ? styles.active : ''}`}
          title="Import names"
        >
          <span className="fa fa-file-import"></span>
        </button>
        <button
          onClick={onToggleTheme}
          className={styles.iconButton}
          title="Toggle theme"
        >
          <span className="fa fa-lightbulb"></span>
        </button>
      </div>

      {/* name input form */}
      <form
        className={styles.nameInputForm}
        onSubmit={handleSubmit}
      >
        {isImportMode ? (
          <textarea
            ref={textareaRef}
            className={styles.nameInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter multiple names (one per line)"
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
          aria-label={isImportMode ? "Replace names" : "Add name"}
        >
          <span className={`fa fa-regular ${isImportMode ? 'fa-square-check' : 'fa-square-plus'}`}></span>
        </button>
      </form>

      {!isImportMode && (
        <NameList
          people={people}
          setPeople={setPeople}
        />
      )}
    </div>
  );
};

export default Controls;
