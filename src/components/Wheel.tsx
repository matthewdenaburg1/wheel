import React, { useState, useEffect } from 'react';
import Sector from './Sector';
import styles from './Wheel.module.scss';

import { usePeople } from '../context/PeopleContext';

interface WheelProps {
  isSpinning: boolean;
  radius: number;
  onSpin: () => void;
  onSpinEnd: (person: Person) => void;
  resetTrigger: boolean;
  spinDuration: number; // in seconds
}

const Wheel: React.FC<WheelProps> = ({ radius, isSpinning, onSpin, onSpinEnd, resetTrigger, spinDuration }) => {
  const { people } = usePeople();
  const [rotation, setRotation] = useState(0);

  const spinDurationMs = spinDuration * 1000;
  const enabledPeople = people.filter((p) => p.enabled);

  const syncSectorAngle = () => {
    const length = enabledPeople.length;
    return length <= 1 ? 359.999 : 360 / Math.floor(length);
  }

  useEffect(() => {
    setSectorAngle(syncSectorAngle());
  }, [enabledPeople.length]);

  const [sectorAngle, setSectorAngle] = useState(syncSectorAngle());

  useEffect(() => {
    if (isSpinning) {
      const winnerIndex = Math.floor(Math.random() * enabledPeople.length); // TODO: this could be improved

      const winner = enabledPeople[winnerIndex];
      const winnerAngle = winnerIndex * sectorAngle + sectorAngle / 2;
      const baseRotations = 2 + Math.floor(spinDuration / 2) + Math.floor(Math.random() * 3);
      const randomRotations = baseRotations * 360;

      const finalRotation = randomRotations - winnerAngle + sectorAngle / 2;

      setRotation(finalRotation);

      setTimeout(() => {
        onSpinEnd(winner);
      }, spinDurationMs);
    }
  }, [isSpinning, enabledPeople, onSpinEnd, sectorAngle, spinDurationMs]);

  useEffect(() => {
    setRotation(0);
  }, [resetTrigger]);

  return (
    <div>
      <div
        className={styles.wheelContainer}
        onClick={onSpin}
      >
        <div className={styles.pointer}></div>
        <div
          className={styles.wheel}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? `transform ${spinDuration}s linear(0, 0.75 60%, 0.859 70%, 0.9375 80%, 0.984 90%, 1)` : 'none',
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
