import React from 'react';
import styles from './Sector.module.scss';
import { hslColorString, isDarkColor } from '../utils/color';

/**
 * @see https://en.wikipedia.org/wiki/Circular_sector
 */
interface SectorProps {
  name: string;
  index: number;
  sectorAngle: number;
  radius: number;
}

const toRadians = (angle: number): number => {
  return angle * (Math.PI / 180);
};

const pointToPathString = (point: { x: number; y: number }): string => {
  return `${point.x} ${point.y}`
};

const Sector: React.FC<SectorProps> = ({ name, index, radius, sectorAngle }) => {
  const color = hslColorString(Math.floor(index * sectorAngle));

  /**
   * Calculates the coordinates of a point on the circumference of the circle at a given angle.
   * @param angle - the angle (in degrees on a unit circle) at which to calculate the point
   * @returns an {x, y} point on the circumference of the circle at the given angle, starting from the center of the circle as (0, 0)
   * @see https://en.wikipedia.org/wiki/Polar_coordinate_system
   */
  const pointAtAngle = (angle: number): { x: number; y: number } => {
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

  const center = pointToPathString({ x: radius / 2, y: radius / 2 });
  const arcStartPoint = pointAtAngle(0);
  const arcEndPoint = pointAtAngle(sectorAngle);
  const largeArcFlag = sectorAngle > 180 ? 1 : 0;

  const arc = [
    center,
    0, // always start at 0
    largeArcFlag,
    1,
    pointToPathString(arcEndPoint)
  ].join(' ');

  /**
   * the clip path for this portion of the sector.
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/basic-shape/path
   */
  const path = [
    `M ${center}`,
    `L ${pointToPathString(arcStartPoint)}`,
    `A ${arc}`,
    'Z',
  ].join(' ');

  return (
    <div
      className={`${styles.slice} `}
      style={{
        backgroundColor: color,
        clipPath: `path("${path}")`,
        // rotate the sector by the appropriate amount based on its index and the sector angle,
        // so that it is positioned correctly on the wheel
        transform: `rotate(${index * sectorAngle - sectorAngle / 2}deg)`,
      }}
    >
      {/* the name of the person, centered in the sector */}
      <div
        className={`${styles.name} ${isDarkColor(color) ? styles.isDark : styles.isLight}`}
        style={{
          // counteract the rotation of the sector when it's added to the wheel by rotating back a little bit, so that the text is always horizontal
          transform: `rotate(${sectorAngle / 2}deg)`,
        }}
      >
        {name}
      </div>
    </div>
  );
};

export default Sector;
