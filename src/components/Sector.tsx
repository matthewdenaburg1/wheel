import React from 'react';
import styles from './Sector.module.scss';
import { degreesToRadians } from '../utils/angle';
import { getHslColor, isColorDark } from '../utils/color';

interface SectorProps {
  name: string;
  angle: number;
  startAngle: number;
  radius: number;
  disabled: boolean;
}

const Sector: React.FC<SectorProps> = ({ name, angle, startAngle, radius, disabled }) => {
  const backgroundColor = getHslColor(startAngle);

  const toPolarPoint = (angleDegrees: number): { x: number; y: number } => {
    const angleRadians = degreesToRadians(angleDegrees);
    const x = radius + radius * Math.cos(angleRadians);
    const y = radius + radius * Math.sin(angleRadians);
    return { x, y };
  };

  const startPoint = toPolarPoint(0);
  const endPoint = toPolarPoint(angle);
  const largeArcFlag = angle > 180 ? 1 : 0;

  const pathData = [
    `M ${radius},${radius}`,
    `L ${startPoint.x},${startPoint.y}`,
    `A ${radius},${radius} 0 ${largeArcFlag} 1 ${endPoint.x},${endPoint.y}`,
    'Z',
  ].join(' ');

  const chord = 2 * radius * Math.sin(degreesToRadians(angle) / 2);

  return (
    <div
      className={`${styles.slice} ${disabled ? styles.disabled : ''}`}
      style={{
        backgroundColor,
        clipPath: `path("${pathData}")`,
        transform: `rotate(${startAngle}deg)`,
      }}
    >
      <div
        className={`${styles.name} ${isColorDark(backgroundColor) ? styles.dark : styles.light}`}
        style={{
          top: `calc(50% - ${chord / 4}px + 1rem)`,
          height: `${chord / 2}px`,
          transform: `rotate(${angle / 2}deg)`,
        }}
      >
        {name}
      </div>
    </div>
  );
};

export default Sector;
