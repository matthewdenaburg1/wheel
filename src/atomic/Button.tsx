import React from 'react';
import styles from '../styles/atomic/Button.module.scss';

interface ButtonProps {
  title: string;
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
  buttonType?: 'button' | 'submit' | 'reset';
  ref?: React.Ref<HTMLButtonElement>;

  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  children,
  active = true,
  className = '',
  ref = undefined,
  buttonType = 'button',
  onClick,
}) => {
  return (
    <button
      title={title}
      className={`${styles.button} ${className}`}
      type={buttonType || 'button'}
      onClick={onClick}
      disabled={!active}
      ref={ref}
    >
      {children}
    </button>
  );
};
