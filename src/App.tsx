import React, { useState, useEffect, useRef } from 'react';
import Controls from './components/Controls';
import Wheel from './components/Wheel';
import WinnerDisplay from './components/WinnerDisplay';
import { useTheme } from './utils/theme';
import { loadNamesFromUrl } from './utils/url';
import styles from './App.module.scss';

export interface Person {
  id: number;
  name: string;
  enabled: boolean;
}

const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [winner, setWinner] = useState<Person | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resetWheelTrigger, setResetWheelTrigger] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const nextId = useRef(0);

  useEffect(() => {
    const namesFromUrl = loadNamesFromUrl();
    let people = []

    if (namesFromUrl.length > 0) {
      people = namesFromUrl.map((name) => ({
        id: nextId.current++,
        name,
        enabled: true,
      }));
    }
    else {
      people = Array.from({ length: 6 }, (_, i) => ({
        id: nextId.current++,
        name: `Person ${i + 1}`,
        enabled: true,
      }));
    }

    people.sort(() => Math.random() - 0.5);
    setPeople(people);
  }, []);

  const handleSpin = () => {
    if (people.filter(p => p.enabled).length > 0 && !isSpinning) {
      setIsSpinning(true);
    }
  };

  const handleSpinEnd = (newWinner: Person) => {
    setWinner(newWinner);
    setIsSpinning(false);
  };

  const handleCloseWinner = () => {
    if (winner) {
      // Disable the winner
      setPeople(
        people.map((person) =>
          person.id === winner.id ? { ...person, enabled: false } : person
        )
      )
    }

    setWinner(null);
    setResetWheelTrigger(!resetWheelTrigger);
  };

  return (
    <div className={`${styles.app} ${theme}`}>
      <div className={styles.header}>
        <h1>Wheel of Names</h1>
      </div>
      <div className={styles.content}>
        <Controls
          people={people}
          setPeople={setPeople}
          onToggleTheme={toggleTheme}
        />
        <Wheel
          people={people}
          isSpinning={isSpinning}
          onSpin={handleSpin}
          onSpinEnd={handleSpinEnd}
          resetTrigger={resetWheelTrigger}
        />
      </div>
      <WinnerDisplay
        winner={winner}
        onClose={handleCloseWinner}
      />
      <div className={styles.forkMe}>
        <div className={styles.wrapper}>
          <a
            href="https://github.com/matthewdenaburg1/wheel"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fork me on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
