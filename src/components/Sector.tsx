import React from 'react';
import styles from './Sector.module.scss';
import { isColorDark } from '../utils/color';

interface SectorProps {
  name: string;
  sectorData: {
    path: string;
    color: string;
    /** @see https://en.wikipedia.org/wiki/Chord_(geometry) */
    chord: number;
  };
  index: number;
  sectorAngle: number;
}

const Sector: React.FC<SectorProps> = ({ name, sectorData, index, sectorAngle }) => {
  return (
    <div
      className={`${styles.slice} `}
      style={{
        backgroundColor: sectorData.color,
        clipPath: `path("${sectorData.path}")`,
        transform: `rotate(${index * sectorAngle - sectorAngle / 2}deg)`,
      }}
    >
      <div
        className={`${styles.name} ${isColorDark(sectorData.color) ? styles.dark : styles.light}`}
        style={{
          top: `calc(50% - 0.5em)`,

          // counteract the rotation of the sector when it's added to the wheel
          transform: `rotate(${sectorAngle / 2}deg)`,
          transformOrigin: 'left'
        }}
      >
        {name}
      </div>
    </div>
  );
};

export default Sector;
