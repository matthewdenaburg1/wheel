import React, { useState, useRef, useEffect } from 'react';
import Controls from './components/Controls';
import Wheel from './components/Wheel';
import WinnerDisplay from './components/WinnerDisplay';

import { SettingsContext, useSettingsState } from './context/SettingsContext';
import { PeopleContext, usePeopleState } from './context/PeopleContext';

import { useTheme } from './utils/theme';
import { parseUrlParams } from './utils/url';

import styles from './App.module.scss';

const initialUrlParams = parseUrlParams();

const App: React.FC = () => {
  const [people, setPeople] = usePeopleState();
  const [settings] = useSettingsState();

  const [winner, setWinner] = useState<Person | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resetWheelTrigger, setResetWheelTrigger] = useState(false);
  const [spinDuration, setSpinDuration] = useState(initialUrlParams.spinDuration);
  const [soundEnabled, setSoundEnabled] = useState(initialUrlParams.soundEnabled);
  const [theme, toggleTheme] = useTheme(initialUrlParams.theme);
  const nextId = useRef(0);

  useEffect(() => {
    const { names: namesFromUrl } = initialUrlParams;
    let people: Person[];

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
    <SettingsContext.Provider value={{ ...settings }}>
      <div className={`${styles.app} ${theme}`}>
        <div className={styles.header}>
          <h1>Wheel of Names</h1>
        </div>
        <div className={styles.content}>
          <PeopleContext.Provider value={{ people, setPeople }}>
            <Controls
              // theme={theme}
              // spinDuration={spinDuration}
              // soundEnabled={soundEnabled}
              // onToggleTheme={toggleTheme}
              // setSpinDuration={setSpinDuration}
              // setSoundEnabled={setSoundEnabled}
              // onShuffle={handleShuffle}
            />
            <Wheel
              isSpinning={isSpinning}
              radius={500}
              onSpin={handleSpin}
              onSpinEnd={handleSpinEnd}
              resetTrigger={resetWheelTrigger}
              spinDuration={spinDuration}
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
    </SettingsContext.Provider>
  );
};

export default App;
