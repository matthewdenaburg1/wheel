import React, { useState } from 'react';
import NameList from './NameList';
import Settings from './Settings';
import styles from './Controls.module.scss';

import { newPerson } from '../context/PeopleContext';

const Controls: React.FC = ({}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (name.trim()) {
      newPerson(name.trim());
      setName('');
    }
  };

  return (
    <div>
      <Settings />
      {/* name input form */}
      <form className={styles.nameInputForm} onSubmit={handleSubmit}>
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
