import React, { useState, useRef, useEffect, useCallback } from 'react';
import SettingsPopover from './SettingsPopover';
import styles from '../styles/components/Settings.module.scss';

import { Button } from '../atomic/Button';

import { useTheme } from '../utils/theme';
import { usePeople } from '../context/PeopleContext';

import { copyShareUrl } from '../utils/url';

// interface SettingsProps {
//   spinDuration?: number;
//   soundEnabled?: boolean;
//   setSpinDuration?: React.Dispatch<React.SetStateAction<number>>;
//   setSoundEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
//   onShuffle?: () => void;
// }

const Settings: React.FC = () => {
  const { people } = usePeople();
  const [ theme, toggleTheme ] = useTheme();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'import' | 'spin' | null>(null);
  const [popoverPos, setPopoverPos] = useState<PopoverPosition | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const gearButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback((): PopoverPosition | null => {
    if (!gearButtonRef.current || !controlsRef.current) {
      return null
    };

    const gearRect = gearButtonRef.current.getBoundingClientRect();
    const controlsRect = controlsRef.current.getBoundingClientRect();
    return {
      top: gearRect.bottom + 8,
      left: controlsRect.left,
      width: controlsRect.width,
      arrowLeft: gearRect.left - controlsRect.left + gearRect.width / 2,
    };
  }, []);

  // Close popover on click outside or Escape; recalculate position on resize
  useEffect(() => {
    if (!isSettingsOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !controlsRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        setIsSettingsOpen(false);
        setActivePanel(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setActivePanel(null);
      }
    };

    const handleResize = () => setPopoverPos(calculatePosition());

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSettingsOpen, calculatePosition]);

  const handleShare = () => {
    copyShareUrl(people.map(p => p.name), theme);
  };

  const toggleSettings = () => {
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
      setActivePanel(null);
      setPopoverPos(null);
    } else {
      setPopoverPos(calculatePosition());
      setIsSettingsOpen(true);
    }
  };

  const togglePanel = (panel: 'import' | 'spin') => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const popover = isSettingsOpen && popoverPos
    ? <SettingsPopover
        ref={popoverRef}
        position={popoverPos}
        activePanel={activePanel}
        onTogglePanel={togglePanel}
      />
    : null;

  return (
    <>
      <div className={styles.settings} ref={controlsRef}>
        <div className={styles.menu}>
          <Button
            title="Share"
            onClick={handleShare}
          >
            <span className="fa fa-share"></span>
          </Button>
          <Button
            onClick={toggleTheme}
            title="Toggle theme"
          >
            <span className="fa fa-lightbulb"></span>
          </Button>
          <Button
            title="Settings"
            ref={gearButtonRef}
            onClick={toggleSettings}
            className={`${styles.settingsButton} ${styles.iconButton}${isSettingsOpen ? ` ${styles.active}` : ''}`}
          >
            <span className="fa fa-gear"></span>
          </Button>
        </div>
      </div>

      {popover}
    </>
  );
};

export default Settings;
