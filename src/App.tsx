import React, { useState, useRef, useEffect } from 'react';
import Controls from './components/Controls';
import Wheel from './components/Wheel';
import WinnerDisplay from './components/WinnerDisplay';

import { PeopleContext, usePeopleState } from './context/PeopleContext';

import { useTheme } from './utils/theme';
import { parseUrlParams } from './utils/url';

import styles from './App.module.scss';

const App: React.FC = () => {
  const initialParameters = parseUrlParams();

  const [people, setPeople] = usePeopleState();
  const nextId = useRef(0);

  const [winner, setWinner] = useState<Person | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resetWheelTrigger, setResetWheelTrigger] = useState(false);
  const themeControls = useTheme(initialParameters.theme);

  useEffect(() => {
    const names = initialParameters.names;
    let people = names.length > 0
      ? names.map((name) => ({
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
    <div className={`${styles.app} ${themeControls.theme}`}>
      <div className={styles.header}>
        <h1>Wheel of Names</h1>
      </div>
      <div className={styles.content}>
        <PeopleContext.Provider value={{ people, setPeople }}>
          <Controls
            themeControls={themeControls}
          />
          <Wheel
            isSpinning={isSpinning}
            radius={500}
            onSpin={handleSpin}
            onSpinEnd={handleSpinEnd}
            resetTrigger={resetWheelTrigger}
          />
        </PeopleContext.Provider>
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
