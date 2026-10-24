import React, { useState, useRef, useEffect } from 'react';
import { AppModeContext, useAppModeState } from './context/AppModeContext';
import Controls from './components/Controls';
import Wheel from './components/Wheel';
import WinnerDisplay from './components/WinnerDisplay';

import { PeopleContext, usePeopleState } from './context/PeopleContext';

import { useTheme } from './utils/theme';
import { loadNamesFromUrl } from './utils/url';

import styles from './App.module.scss';

const App: React.FC = () => {
  const [people, setPeople] = usePeopleState();
  const [winner, setWinner] = useState<Person | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resetWheelTrigger, setResetWheelTrigger] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const [roundComplete, setRoundComplete] = useState(false);
  const nextId = useRef(0);
  const [mode, setMode] = useAppModeState();

  useEffect(() => {
    if (mode === 'normal') {
      setPeople((prev) => prev.map((p) => ({ ...p, enabled: true, order: undefined })));
    }
  }, [mode]);

  useEffect(() => {
    const namesFromUrl = loadNamesFromUrl().sort(() => Math.random() - 0.5);
    const people =
      namesFromUrl.length > 0
        ? namesFromUrl.map((name) => ({
            id: nextId.current++,
            name,
            enabled: true,
          }))
        : Array.from({ length: 6 }, (_, i) => ({
            id: nextId.current++,
            name: `Person ${i + 1}`,
            enabled: true,
          }));

    people.sort(() => Math.random() - 0.5);
    setPeople(people);
  }, []);

  const handleSpin = () => {
    if (people.filter((p) => p.enabled).length > 0 && !isSpinning) {
      setIsSpinning(true);
    }
  };

  const handleSpinEnd = (newWinner: Person) => {
    setWinner(newWinner);
    setIsSpinning(false);
  };

  const handleCloseWinner = () => {
    if (winner) {
      if (mode === 'round-robin') {
        const nextOrder = people.filter((p) => p.order !== undefined).length + 1;
        const updatedPeople = people.map((p) =>
          p.id === winner.id ? { ...p, enabled: false, order: nextOrder } : p,
        );
        setPeople(updatedPeople);
        const allDone = updatedPeople.every((p) => p.order !== undefined);
        if (allDone) {
          setRoundComplete(true);
        }
      } else {
        setPeople(people.map((p) => (p.id === winner.id ? { ...p, enabled: false } : p)));
      }
    }
    setWinner(null);
    setResetWheelTrigger(!resetWheelTrigger);
  };

  const handleCloseRoundComplete = () => {
    setRoundComplete(false);
  };

  return (
    <AppModeContext.Provider value={{ mode, setMode }}>
      <div className={`${styles.app} ${theme}`}>
        <div className={styles.header}>
          <h1>Wheel of Names</h1>
        </div>
        <PeopleContext.Provider value={{ people, setPeople }}>
          <div className={styles.content}>
            <Controls onToggleTheme={toggleTheme} />
            <Wheel
              isSpinning={isSpinning}
              radius={500}
              onSpin={handleSpin}
              onSpinEnd={handleSpinEnd}
              resetTrigger={resetWheelTrigger}
            />
          </div>
          <WinnerDisplay
            winner={winner}
            isRoundComplete={roundComplete}
            onClose={roundComplete ? handleCloseRoundComplete : handleCloseWinner}
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
        </PeopleContext.Provider>
      </div>
    </AppModeContext.Provider>
  );
};

export default App;
