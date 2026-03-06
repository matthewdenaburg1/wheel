import React, { useState } from 'react';
import styles from './NameInput.module.scss';

interface NameInputProps {
  onAddName: (name: string) => void;
}

const NameInput: React.FC<NameInputProps> = ({ onAddName }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddName(name.trim());
      setName('');
    }
  };

  return (
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
  );
};

export default NameInput;
