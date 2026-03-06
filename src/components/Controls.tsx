import React from 'react';
import NameInput from './NameInput';
import NameList from './NameList';
import styles from './Controls.module.scss';
import { Person } from './App';

interface ControlsProps {
  people: Person[];
  onAddName: (name: string) => void;
  onToggleEnabled: (id: number) => void;
  onShare: () => void;
  onToggleTheme: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  people,
  onAddName,
  onToggleEnabled,
  onShare,
  onToggleTheme,
}) => {
  return (
    <div className={styles.controls}>
      <div className={styles.menu}>
        <button
          onClick={onShare}
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
      <NameInput onAddName={onAddName} />
      <NameList
        people={people}
        onRemoveName={() => {}}
        onToggleEnabled={onToggleEnabled}
      />
    </div>
  );
};

export default Controls;
