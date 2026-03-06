import React, { useState, useRef } from 'react';
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
  const nextId = useRef(0);

  const handleAddName = (name: string) => {
    const newPerson: Person = {
      id: nextId.current++,
      name,
      enabled: true,
    };

    setPeople([...people, newPerson]);
  };

  const handleShare = () => {
    shareUrl(people.map(p => p.name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim()) {
      handleAddName(name.trim());
      setName('');
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
        <input
          type="text"
          className={styles.nameInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name"
        />
        <button
          type="submit"
          className={styles.addButton}
          aria-label="Add"
        >
          <span className="fa fa-regular fa-square-plus"></span>
        </button>
      </form>

      <NameList
        people={people}
        setPeople={setPeople}
      />
    </div>
  );
};

export default Controls;
