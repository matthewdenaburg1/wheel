import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { usePeople } from '../context/PeopleContext';

import { Button } from '../atomic/Button';

import styles from '../styles/components/SettingsPopover.module.scss';

interface SettingsPopoverProps {
  position: PopoverPosition;
  activePanel: 'import' | 'spin' | null;
  onTogglePanel: (panel: 'import' | 'spin') => void;
}

const SettingsPopover = forwardRef<HTMLDivElement, SettingsPopoverProps>(function SettingsPopover({
  position,
  activePanel,
  onTogglePanel,
}, ref) {
  const { setPeople } = usePeople();
  // const { spinDuration, setSpinDuration } = useSettings();

  const nextId = useRef(0);

  const [isImportMode, setIsImportMode] = useState(false);
  const [importValue, setImportValue] = useState('');
  const importTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize import textarea
  useEffect(() => {
    if (importTextareaRef.current) {
      importTextareaRef.current.style.height = 'auto';
      importTextareaRef.current.style.height = `${importTextareaRef.current.scrollHeight}px`;
    }
  }, [importValue]);

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

  const importPanel = (
    <>
      <form className={styles.subMenuPanel} onSubmit={handleImportSubmit}>
        <textarea
          ref={importTextareaRef}
          className={styles.nameInput}
          value={importValue}
          onChange={(e) => setImportValue(e.target.value)}
          placeholder="Enter names, one per line"
          rows={3}
        />
        <Button
          title="Import"
          buttonType="submit"
          className={styles.addButton}
        >
          <span className="fa fa-regular fa-square-plus"></span>
        </Button>
      </form>
    </>
  );
  // const spinPanel = (
  //   <>
  //     <div className={styles.subMenuPanel}>
  //       <div className={styles.spinSlider}>
  //         <input
  //           type="range"
  //           title="Spin duration"
  //           min={1}
  //           max={20}
  //           value={spinDuration}
  //           onChange={(e) => setSpinDuration(Number(e.target.value))}
  //         />
  //         <span className={styles.spinValue}>{spinDuration}s</span>
  //       </div>
  //     </div>
  //   </>
  // );

  return createPortal(
    <div
      ref={ref}
      className={styles.settingsPopover}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        '--arrow-left': `${position.arrowLeft}px`,
      } as React.CSSProperties}
    >
      <div className={styles.subMenuRow}>
        <Button
          onClick={() => setIsImportMode(!isImportMode)}
          title="Import"
        >
          <span className="fa fa-file-import"></span>
        </Button>
        {/* sound button hidden for now */}
        {/* <button
          className={styles.iconButton}
          title={soundEnabled ? 'Sound on' : 'Sound off'}
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          <span className={`fa fa-${soundEnabled ? 'microphone' : 'microphone-slash'}`}></span>
        </button> */}
        <Button
          className={styles.iconButton}
          title="Shuffle names"
          // onClick={onShuffle}
        >
          <span className="fa fa-shuffle"></span>
        </Button>
        <Button
          className={`${styles.iconButton}${activePanel === 'spin' ? ` ${styles.active}` : ''}`}
          title="Spin duration"
          onClick={() => onTogglePanel('spin')}
        >
          <span className="fa fa-gauge-high"></span>
        </Button>
        <Button
          className={`${styles.iconButton}${activePanel === 'import' ? ` ${styles.active}` : ''}`}
          title="Import names"
          onClick={() => onTogglePanel('import')}
        >
          <span className="fa fa-file-import"></span>
        </Button>
      </div>

      {activePanel === 'import' && importPanel}
      {/* {activePanel === 'spin' && spinPanel} */}
    </div>,
    document.body,
  );
});

export default SettingsPopover;
