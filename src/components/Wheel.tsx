import React, { useState, useEffect, useMemo } from 'react';
import Sector from './Sector';
import styles from './Wheel.module.scss';

import { usePeople } from '../context/PeopleContext';

interface WheelProps {
  isSpinning: boolean;
  radius: number;
  resetTrigger: boolean;
  onSpin: () => void;
  onSpinEnd: (person: Person) => void;
}

const SPIN_DURATION = 1500; // in milliseconds

const Wheel: React.FC<WheelProps> = ({ isSpinning, radius, onSpin, onSpinEnd, resetTrigger }) => {
  const { people } = usePeople();
  const [rotation, setRotation] = useState(0);
  const enabledPeople = useMemo(() => people.filter((p) => p.enabled), [people]);

  const syncSectorAngle = () => {
    const length = enabledPeople.length;
    return length <= 1 ? 359.999 : 360 / Math.floor(length);
  };

  useEffect(() => {
    setSectorAngle(syncSectorAngle());
  }, [enabledPeople.length]);

  const [sectorAngle, setSectorAngle] = useState(syncSectorAngle());

  useEffect(() => {
    if (isSpinning && enabledPeople.length > 0) {
      const winnerIndex = Math.floor(Math.random() * enabledPeople.length);

      const winner = enabledPeople[winnerIndex];
      const winnerAngle = winnerIndex * sectorAngle + sectorAngle / 2;
      const randomRotations = Math.floor(Math.random() * 3 + 2) * 360;

      const finalRotation = randomRotations - winnerAngle + sectorAngle / 2;

      setRotation(finalRotation);

      const timer = setTimeout(() => {
        onSpinEnd(winner);
      }, SPIN_DURATION);

      return () => clearTimeout(timer);
    }
  }, [isSpinning]);

  useEffect(() => {
    setRotation(0);
  }, [resetTrigger]);

  return (
    <div>
      <div
        className={styles.wheelContainer}
        onClick={onSpin}
        data-testid="wheel-container"
      >
        <div className={styles.pointer}></div>
        <div
          className={styles.wheel}
          data-testid="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? `transform ${SPIN_DURATION / 1000}s ease-out` : 'none',
          }}
        >
          {
            enabledPeople.map((person, index) => {
              return <Sector
                key={person.id}
                name={person.name}
                index={index}
                radius={radius}
                sectorAngle={sectorAngle}
              />;
            })
          }
        </div>
        <div className={styles.caption}>Click to Spin!</div>
      </div>
    </div>
  );
};

export default Wheel;
