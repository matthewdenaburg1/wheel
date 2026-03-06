import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Controls from './Controls';
import Wheel from './Wheel';
import WinnerDisplay from './WinnerDisplay';
import WheelCaption from './WheelCaption';
import ForkMe from './ForkMe';
import { useTheme } from '../utils/theme';
import { loadNamesFromUrl, shareUrl } from '../utils/url';
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
  const [theme, toggleTheme] = useTheme();
  const nextId = useRef(0);

  useEffect(() => {
    const namesFromUrl = loadNamesFromUrl();
    if (namesFromUrl.length > 0) {
      const newPeople = namesFromUrl.map((name) => ({
        id: nextId.current++,
        name,
        enabled: true,
      }));
      setPeople(newPeople);
    } else {
      setPeople([
        { id: nextId.current++, name: 'Person 1', enabled: true },
        { id: nextId.current++, name: 'Person 2', enabled: true },
        { id: nextId.current++, name: 'Person 3', enabled: true },
      ]);
    }
  }, []);

  const handleAddName = (name: string) => {
    const newPerson: Person = {
      id: nextId.current++,
      name,
      enabled: true,
    };
    setPeople([...people, newPerson]);
  };

  const handleRemoveName = (idToRemove: number) => {
    setPeople(people.filter((person) => person.id !== idToRemove));
  };

  const handleToggleEnabled = (idToToggle: number) => {
    setPeople(
      people.map((person) =>
        person.id === idToToggle ? { ...person, enabled: !person.enabled } : person
      )
    );
  };

  const handleSpin = () => {
    if (people.filter(p => p.enabled).length > 0 && !isSpinning) {
      setIsSpinning(true);
    }
  };

  const handleSpinEnd = (newWinner: Person) => {
    setWinner(newWinner);
  };

  const handleCloseWinner = () => {
    if (winner) {
      handleToggleEnabled(winner.id); // Disable the winner
    }
    setWinner(null);
    setIsSpinning(false);
  };

  const handleShare = () => {
    shareUrl(people.map(p => p.name));
  };

  return (
    <div className={`${styles.app} ${theme}`}>
      <Header />
      <div className={styles.content}>
        <Controls
          people={people}
          onAddName={handleAddName}
          onRemoveName={handleRemoveName}
          onToggleEnabled={handleToggleEnabled}
          onSpin={handleSpin}
          onShare={handleShare}
          onToggleTheme={toggleTheme}
        />
        <div>
          <Wheel
            people={people}
            onSpin={handleSpin}
            onSpinEnd={handleSpinEnd}
            isSpinning={isSpinning}
          />
          <WheelCaption />
        </div>
      </div>
      <WinnerDisplay
        winner={winner}
        onClose={handleCloseWinner}
      />
      <ForkMe />
    </div>
  );
};

export default App;
