import React from 'react';
import styles from './ForkMe.module.scss';

const ForkMe: React.FC = () => {
  return (
    <div className={styles.forkMe}>
      <div className={styles.wrapper}>
        <a
          href="https://github.com/matthewdenaburg1/wheel"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fork me on GitHub
        </a>
      </div>
    </div>
  );
};

export default ForkMe;
