import React, { useState, useEffect } from 'react';
import Sector from './Sector';
import styles from './Wheel.module.scss';
import { Person } from '../App';
import { getHslColor } from '../utils/color';

interface WheelProps {
  people: Person[];
  isSpinning: boolean;
  onSpin: () => void;
  onSpinEnd: (person: Person) => void;
  resetTrigger: boolean;
}

const SPIN_DURATION = 1500; // in milliseconds

const Wheel: React.FC<WheelProps> = ({ people, isSpinning , onSpin, onSpinEnd, resetTrigger }) => {
  const [rotation, setRotation] = useState(0);
  const radius = 500; // TODO
  const enabledPeople = people.filter((p) => p.enabled);

  const sectorAngle = enabledPeople.length <= 1 ? 359.999 : 360 / enabledPeople.length;

  useEffect(() => {
    if (isSpinning) {
      const winnerIndex = Math.floor(Math.random() * enabledPeople.length); // TODO: this could be improved

      const winner = enabledPeople[winnerIndex];
      const winnerAngle = winnerIndex * sectorAngle + sectorAngle / 2;
      const randomRotations = Math.floor(Math.random() * 3 + 2) * 360;

      const finalRotation = randomRotations - winnerAngle + sectorAngle / 2;

      setRotation(finalRotation);

      setTimeout(() => {
        onSpinEnd(winner);
      }, SPIN_DURATION);
    }
  }, [isSpinning, enabledPeople, onSpinEnd, sectorAngle]);

  useEffect(() => {
    setRotation(0);
  }, [resetTrigger]);

  const toRadians = (angle: number): number => {
    return angle * (Math.PI / 180);
  };

  const vectorAngleToPoint = (angle: number): { x: number; y: number } => {
    const angleRadians = toRadians(angle);
    let x = radius + radius * Math.cos(angleRadians);
    let y = radius + radius * Math.sin(angleRadians);

    // divide by 2 since we're starting from the center
    x /= 2;
    y /= 2;

    // to 3 decimal places
    x = Math.round(x * 1000) / 1000;
    y = Math.round(y * 1000) / 1000;

    return { x, y };
  };

  const pointToPathString = (point: { x: number; y: number }): string => {
    return `${point.x} ${point.y}`
  };

  const createSector = (index: number): {
    color: string;
    path: string;
    chord: number;
  } => {
    const center = pointToPathString({ x: radius / 2, y: radius / 2 });
    const arcStartPoint = vectorAngleToPoint(0);
    const arcEndPoint = vectorAngleToPoint(sectorAngle);
    const largeArcFlag = sectorAngle > 180 ? 1 : 0;

    const arc = [
      center,
      0, // always start at 0
      largeArcFlag,
      1,
      pointToPathString(arcEndPoint)
    ].join(' ');

    const path = [
      `M ${center}`,
      `L ${pointToPathString(arcStartPoint)}`,
      `A ${arc}`,
      'Z',
    ].join(' ');

    return {
      color: getHslColor(Math.floor(index * sectorAngle)),
      path: path,
      chord: enabledPeople.length === 1 ? radius : Math.sin(toRadians(sectorAngle) / 2),
    }
  };

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
            transition: isSpinning ? `transform ${SPIN_DURATION / 1000}s ease-out` : 'none',
          }}
        >
          {
            enabledPeople.map((person, index) => {
              return <Sector
                key={person.id}
                name={person.name}
                sectorData={createSector(index)}
                index={index}
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
