import React, { useState, useEffect } from 'react';
import Sector from './Sector';
import styles from './Wheel.module.scss';
import { Person } from './App';

interface WheelProps {
  people: Person[];
  onSpin: () => void;
  onSpinEnd: (winner: Person) => void;
  isSpinning: boolean;
}

const SPIN_DURATION = 1500; // in milliseconds

const Wheel: React.FC<WheelProps> = ({ people, onSpin, onSpinEnd, isSpinning }) => {
  const [rotation, setRotation] = useState(0);
  const diameter = 500;
  const enabledPeople = people.filter((p) => p.enabled);
  const sectorAngle = 360 / (enabledPeople.length || 1);

  useEffect(() => {
    if (isSpinning) {
      const winnerIndex = Math.floor(Math.random() * enabledPeople.length);
      const winner = enabledPeople[winnerIndex];

      const randomRotations = Math.floor(Math.random() * 3 + 2) * 360;

      const winnerAngle = winnerIndex * sectorAngle;

      const finalRotation = randomRotations - winnerAngle + sectorAngle / 2;

      setRotation(finalRotation);

      setTimeout(() => {
        onSpinEnd(winner);
      }, SPIN_DURATION);
    }
  }, [isSpinning, enabledPeople, onSpinEnd, sectorAngle]);

  return (
    <div
      className={styles.wheelContainer}
      onClick={onSpin}
    >
      <div
        className={styles.wheel}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? `transform ${SPIN_DURATION / 1000}s ease-out` : 'none',
        }}
      >
        {enabledPeople.map((person, index) => (
          <Sector
            key={person.id}
            name={person.name}
            angle={sectorAngle}
            startAngle={index * sectorAngle}
            radius={diameter / 2}
            disabled={!person.enabled}
          />
        ))}
      </div>
    </div>
  );
};

export default Wheel;
