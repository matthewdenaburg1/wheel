import React from "react";
import styles from "./WinnerDisplay.module.scss";
import confetti from "canvas-confetti";

interface WinnerDisplayProps {
  winner: Person | null;
  onClose: () => void;
  isRoundComplete?: boolean;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  winner,
  onClose,
  isRoundComplete
}) => {
  // Show round-complete message without confetti
  if (isRoundComplete) {
    return (
      <div className={styles.winnerOverlay} onClick={onClose}>
        <div className={styles.winnerBox}>
          <h3>Everyone has had a turn!</h3>
        </div>
      </div>
    );
  }

  if (!winner) {
    return null;
  }

  // Trigger confetti for a normal winner
  confetti({
    particleCount: 75,
    spread: 70,
    origin: { y: 0.6 }
  });

  return (
    <div className={styles.winnerOverlay} onClick={onClose}>
      <div className={styles.winnerBox}>
        <h3>Next up is...</h3>
        <h1>{winner.name}</h1>
      </div>
    </div>
  );
};

export default WinnerDisplay;
