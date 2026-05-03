import React, { useState, useRef, useEffect, useCallback } from 'react';
import NameList from './NameList';
import SettingsPopover from './SettingsPopover';
import styles from './Controls.module.scss';
import { usePeople } from '../context/PeopleContext';

import { copyShareUrl } from '../utils/url';

interface PopoverPosition {
  top: number;
  left: number;
  width: number;
  arrowLeft: number;
}

interface ControlsProps {
  onToggleTheme: () => void;
  theme: string;
  spinDuration: number;
  setSpinDuration: React.Dispatch<React.SetStateAction<number>>;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onShuffle: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onToggleTheme,
  theme,
  spinDuration,
  setSpinDuration,
  soundEnabled,
  setSoundEnabled,
  onShuffle,
}) => {
  const { people, setPeople } = usePeople();
  const [name, setName] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'import' | 'spin' | null>(null);
  const [importValue, setImportValue] = useState('');
  const [popoverPos, setPopoverPos] = useState<PopoverPosition | null>(null);
  const nextId = useRef(0);
  const controlsRef = useRef<HTMLDivElement>(null);
  const gearButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback((): PopoverPosition | null => {
    if (!gearButtonRef.current || !controlsRef.current) return null;
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

  const handleAddName = (name: string) => {
    const newPerson: Person = {
      id: nextId.current++,
      name,
      enabled: true,
    };

    setPeople([...people, newPerson]);
  };

  const handleShare = () => {
    copyShareUrl(people.map(p => p.name), theme, spinDuration, soundEnabled);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      handleAddName(name.trim());
      setName('');
    }
  };

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
        onTogglePanel={togglePanel}
        onToggleTheme={onToggleTheme}
        onShuffle={onShuffle}
        spinDuration={spinDuration}
        setSpinDuration={setSpinDuration}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onImportSubmit={handleImportSubmit}
        importValue={importValue}
        setImportValue={setImportValue}
        onClose={() => { setIsSettingsOpen(false); setActivePanel(null); }}
      />
    : null;

  return (
    <>
      <div className={styles.controls} ref={controlsRef}>
        <div className={styles.menu}>
          <button
            onClick={handleShare}
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

        {/* name input form */}
        <form className={styles.nameInputForm} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.nameInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name"
          />
          <button
            type="submit"
            className={styles.addButton}
            aria-label="Add"
          >
            <span className="fa fa-regular fa-square-plus"></span>
          </button>
        </form>

        <NameList />
      </div>
      {popover}
    </>
  );
};

export default Controls;
