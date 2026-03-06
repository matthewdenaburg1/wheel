import React from 'react';
import styles from './WinnerDisplay.module.scss';
import confetti from 'canvas-confetti';
import { Person } from './App';

interface WinnerDisplayProps {
  winner: Person | null;
  onClose: () => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winner, onClose }) => {
  if (!winner) {
    return null;
  }

  // Trigger confetti when the component renders with a winner
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  return (
    <div
      className={styles.winnerOverlay}
      onClick={onClose}
    >
      <div className={styles.winnerBox}>
        <h3>Next up is...</h3>
        <h1>{winner.name}</h1>
      </div>
    </div>
  );
};

export default WinnerDisplay;
