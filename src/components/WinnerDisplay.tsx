import React from 'react';
import styles from './WinnerDisplay.module.scss';
import confetti from 'canvas-confetti';

interface WinnerDisplayProps {
  winner: Person | null;
  confettiOverrides?: confetti.Options;
  onClose: () => void;
}

const showConfetti = (overrides: confetti.Options = {}) => {
  const confettiShared = {
    particleCount: 50,
    spread: 50,
    disableForReducedMotion: true,
  };

  const adjustments = {
    right: { origin: { x: 0.8, y: 0.6 }, angle: 135, drift: -1 },
    left:  { origin: { x: 0.2, y: 0.6 }, angle:  45, drift:  1 },
  };

  confetti({ ...confettiShared, ...adjustments.right, ...overrides, });
  confetti({ ...confettiShared, ...adjustments.left, ...overrides, });
};

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ winner, onClose, confettiOverrides }) => {
  if (!winner) {
    return null;
  }

  // Trigger confetti when the component renders with a winner
  showConfetti(confettiOverrides);

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
