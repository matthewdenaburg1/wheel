import React, { useState, useRef, useEffect, useCallback } from 'react';
import SettingsPopover from './SettingsPopover';
import styles from './Settings.module.scss';
import { DEFAULT_SPIN_DURATION } from '../constants'
import { Theme } from '../utils/theme';

import { usePeople } from '../context/PeopleContext';

import { copyShareUrl } from '../utils/url';

interface PopoverPosition {
  top: number;
  left: number;
  width: number;
  arrowLeft: number;
}

interface SettingsProps {
  theme?: Theme;
  spinDuration?: number;
  soundEnabled?: boolean;
  onToggleTheme?: () => void;
  setSpinDuration?: React.Dispatch<React.SetStateAction<number>>;
  setSoundEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
  onShuffle?: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  // theme,
  // soundEnabled,
  // spinDuration,
  // onToggleTheme,
  // setSpinDuration,
  // setSoundEnabled,
  // onShuffle,
}) => {
  const { people, setPeople } = usePeople();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'import' | 'spin' | null>(null);
  const [importValue, setImportValue] = useState('');
  const [popoverPos, setPopoverPos] = useState<PopoverPosition | null>(null);
  const nextId = useRef(0);
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

  // const handleShare = () => {
  //   copyShareUrl(people.map(p => p.name), theme, spinDuration, soundEnabled);
  // };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = importValue
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length > 0) {
      nextId.current = 0;
      const newPeople = names.map((name) => ({
        id: nextId.current++,
        name,
        enabled: true,
      }));
      setPeople(newPeople);
      setImportValue('');
    }
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
        spinDuration={DEFAULT_SPIN_DURATION}
        soundEnabled={false}
        importValue={importValue}
        onTogglePanel={togglePanel}
        onToggleTheme={() => {}}
        onShuffle={() => {}}
        setSpinDuration={() => {}}
        setSoundEnabled={() => {}}
        // onToggleTheme={onToggleTheme}
        // onShuffle={onShuffle}
        // setSpinDuration={setSpinDuration}
        // setSoundEnabled={setSoundEnabled}
        onImportSubmit={handleImportSubmit}
        setImportValue={setImportValue}
        onClose={() => { setIsSettingsOpen(false); setActivePanel(null); }}
      />
    : null;

  return (
    <>
      <div className={styles.settings} ref={controlsRef}>
        <div className={styles.menu}>
          <button
            // onClick={handleShare}
            className={styles.iconButton}
            title="Share"
          >
            <span className="fa fa-share"></span>
          </button>
          <button
            ref={gearButtonRef}
            onClick={toggleSettings}
            className={`${styles.settingsButton} ${styles.iconButton}${isSettingsOpen ? ` ${styles.active}` : ''}`}
            title="Settings"
          >
            <span className="fa fa-gear"></span>
          </button>
        </div>
      </div>

      {popover}
    </>
  );
};

export default Settings;
