import React from 'react';
import NameInput from './NameInput';
import NameList from './NameList';
import styles from './Controls.module.scss';
import { Person } from './App';

interface ControlsProps {
  people: Person[];
  onAddName: (name: string) => void;
  onRemoveName: (id: number) => void;
  onToggleEnabled: (id: number) => void;
  onSpin: () => void;
  onShare: () => void;
  onToggleTheme: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  people,
  onAddName,
  onRemoveName,
  onToggleEnabled,
  onSpin,
  onShare,
  onToggleTheme,
}) => {
  return (
    <div className={styles.controls}>
      <div className={styles.menu}>
        <button
          onClick={onSpin}
          className={styles.iconButton}
          title="Spin"
        >
          <span className="fa fa-light fa-play"></span>
        </button>
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
        onRemoveName={onRemoveName}
        onToggleEnabled={onToggleEnabled}
      />
    </div>
  );
};

export default Controls;
