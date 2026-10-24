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
  const [scale, setScale] = useState(1);
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
    const updateScale = () => {
      if (window.innerWidth > window.innerHeight) {
        // More horizontal space than vertical: vertical space is the constraint
        const targetSize = Math.min(window.innerHeight * 0.7, window.innerWidth * 0.6, radius);
        setScale(targetSize / radius);
      } else {
        // More vertical space than horizontal: horizontal space is the constraint
        if (window.innerWidth <= 768) {
          const targetSize = Math.min(window.innerWidth * 0.65, 300);
          setScale(targetSize / radius);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [radius]);

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
  }, [isSpinning, enabledPeople, sectorAngle, onSpinEnd]);

  useEffect(() => {
    setRotation(0);
  }, [resetTrigger]);

  const scaledDimension = radius * scale;

  return (
    <div className={styles.wheelWrapper}>
      <div
        className={styles.wheelScaler}
        style={{
          width: `${scaledDimension}px`,
          height: `${scaledDimension}px`,
        }}
      >
        <div
          className={styles.wheelContainer}
          onClick={onSpin}
          data-testid="wheel-container"
          style={{
            width: `${radius}px`,
            height: `${radius}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
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
                  person={person}
                  index={index}
                  radius={radius}
                  sectorAngle={sectorAngle}
                />;
              })
            }
          </div>
        </div>
      </div>
      <div className={styles.caption}>Click to Spin!</div>
    </div>
  );
};

export default Wheel;
