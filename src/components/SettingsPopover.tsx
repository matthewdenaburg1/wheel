import React, { forwardRef, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Controls.module.scss';

interface PopoverPosition {
  top: number;
  left: number;
  width: number;
  arrowLeft: number;
}

interface SettingsPopoverProps {
  position: PopoverPosition;
  activePanel: 'import' | 'spin' | null;
  onTogglePanel: (panel: 'import' | 'spin') => void;
  onToggleTheme: () => void;
  onShuffle: () => void;
  spinDuration: number;
  setSpinDuration: React.Dispatch<React.SetStateAction<number>>;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  onImportSubmit: (e: React.FormEvent) => void;
  importValue: string;
  setImportValue: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
}

const SettingsPopover = forwardRef<HTMLDivElement, SettingsPopoverProps>(function SettingsPopover({
  position,
  activePanel,
  onTogglePanel,
  onToggleTheme,
  onShuffle,
  spinDuration,
  setSpinDuration,
  soundEnabled,
  setSoundEnabled,
  onImportSubmit,
  importValue,
  setImportValue,
  onClose,
}, ref) {
  const importTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize import textarea
  useEffect(() => {
    if (importTextareaRef.current) {
      importTextareaRef.current.style.height = 'auto';
      importTextareaRef.current.style.height = `${importTextareaRef.current.scrollHeight}px`;
    }
  }, [importValue]);

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
        <button
          className={styles.iconButton}
          title="Toggle theme"
          onClick={onToggleTheme}
        >
          <span className="fa fa-lightbulb"></span>
        </button>
        {/* sound button hidden for now */}
        {/* <button
          className={styles.iconButton}
          title={soundEnabled ? 'Sound on' : 'Sound off'}
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          <span className={`fa fa-${soundEnabled ? 'microphone' : 'microphone-slash'}`}></span>
        </button> */}
        <button
          className={styles.iconButton}
          title="Shuffle names"
          onClick={onShuffle}
        >
          <span className="fa fa-shuffle"></span>
        </button>
        <button
          className={`${styles.iconButton}${activePanel === 'spin' ? ` ${styles.active}` : ''}`}
          title="Spin duration"
          onClick={() => onTogglePanel('spin')}
        >
          <span className="fa fa-gauge-high"></span>
        </button>
        <button
          className={`${styles.iconButton}${activePanel === 'import' ? ` ${styles.active}` : ''}`}
          title="Import names"
          onClick={() => onTogglePanel('import')}
        >
          <span className="fa fa-file-import"></span>
        </button>
      </div>

      {activePanel === 'import' && (
        <form className={styles.subMenuPanel} onSubmit={onImportSubmit}>
          <textarea
            ref={importTextareaRef}
            className={styles.nameInput}
            value={importValue}
            onChange={(e) => setImportValue(e.target.value)}
            placeholder="Enter names, one per line"
            rows={3}
          />
          <button
            type="submit"
            className={styles.addButton}
            aria-label="Import"
          >
            <span className="fa fa-regular fa-square-plus"></span>
          </button>
        </form>
      )}

      {activePanel === 'spin' && (
        <div className={styles.subMenuPanel}>
          <div className={styles.spinSlider}>
            <input
              type="range"
              min={1}
              max={20}
              value={spinDuration}
              onChange={(e) => setSpinDuration(Number(e.target.value))}
            />
            <span className={styles.spinValue}>{spinDuration}s</span>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
});

export default SettingsPopover;
