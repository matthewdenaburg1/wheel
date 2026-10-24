import React, { useState, useRef, useEffect } from "react";
import NameList from "./NameList";
import styles from "./Controls.module.scss";
import { usePeople } from "../context/PeopleContext";
import { shareUrl } from "../utils/url";
import { useAppMode, type AppMode } from "../context/AppModeContext";

interface ControlsProps {
  onToggleTheme: () => void;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
}

const MODE_LABELS: Record<AppMode, string> = {
  normal: "Normal",
  "round-robin": "Round Robin"
};

const Controls: React.FC<ControlsProps> = ({ onToggleTheme }) => {
  const { people, setPeople } = usePeople();
  const { mode, setMode } = useAppMode();
  const [name, setName] = useState("");
  const [isImportMode, setIsImportMode] = useState(false);
  const [importValue, setImportValue] = useState("");
  const [activeMenu, setActiveMenu] = useState<"gear" | "hamburger" | null>(
    null
  );
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [isMobileModeOpen, setIsMobileModeOpen] = useState(false);
  const nextId = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isImportMode && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [importValue, isImportMode]);

  // Close mobile dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setIsMobileModeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeMenu !== "gear") setIsMobileModeOpen(false);
  }, [activeMenu]);

  const handleAddName = (name: string) => {
    const newPerson: Person = {
      id: nextId.current++,
      name,
      enabled: true
    };

    setPeople([...people, newPerson]);
  };

  const handleShare = () => {
    shareUrl(people.map(p => p.name));
    setActiveMenu(null);
  };

  const handleToggleThemeClick = () => {
    onToggleTheme();
    setActiveMenu(null);
  };

  const handleToggleImport = () => {
    setIsImportMode(!isImportMode);
    setActiveMenu(null);
  };

  // Modular menu configurations for future extensions
  const gearMenuItems: MenuItem[] = [
    {
      id: "theme",
      label: "Toggle Theme",
      icon: "fa-lightbulb",
      onClick: handleToggleThemeClick
    }
  ];

  const hamburgerMenuItems: MenuItem[] = [
    {
      id: "share",
      label: "Share",
      icon: "fa-share",
      onClick: handleShare
    },
    {
      id: "import",
      label: isImportMode ? "Back to List" : "Import Names",
      icon: "fa-file-import",
      onClick: handleToggleImport
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isImportMode) {
      const names = importValue
        .split("\n")
        .map(n => n.trim())
        .filter(n => n.length > 0);

      if (names.length > 0) {
        nextId.current = 0;
        const newPeople = names.map(name => ({
          id: nextId.current++,
          name,
          enabled: true
        }));
        setPeople(newPeople);
        setImportValue("");
        setIsImportMode(false);
      }
    } else {
      if (name.trim()) {
        handleAddName(name.trim());
        setName("");
      }
    }
  };

  return (
    <div className={styles.controls}>
      {/* Desktop Menu */}
      <div className={styles.desktopMenu}>
        <button
          onClick={handleShare}
          className={styles.iconButton}
          title="Share"
        >
          <span className="fa fa-share"></span>
        </button>
        <button
          onClick={onToggleTheme}
          className={styles.iconButton}
          title="Toggle theme"
        >
          <span className="fa fa-lightbulb"></span>
        </button>
        <button
          onClick={() => setIsImportMode(!isImportMode)}
          className={styles.iconButton}
          title="Import"
        >
          <span className="fa fa-file-import"></span>
        </button>
        <div className={styles.modeMenuWrapper}>
          <button
            className={styles.modeButton}
            onClick={() => setIsModeMenuOpen(open => !open)}
            title="App mode"
            aria-label="App mode"
            aria-expanded={isModeMenuOpen}
            aria-haspopup="menu"
          >
            <span className="fa fa-sliders" aria-hidden="true"></span>
          </button>
          {isModeMenuOpen && (
            <div className={styles.modeMenu} role="group" aria-label="App mode">
              {(["normal", "round-robin"] as const).map(option => (
                <button
                  key={option}
                  className={styles.modeMenuOption}
                  aria-pressed={mode === option}
                  onClick={() => {
                    setMode(option);
                    setIsModeMenuOpen(false);
                  }}
                >
                  {MODE_LABELS[option]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menus Container (Vertically Stacked Icons in Top Right) */}
      <div className={styles.mobileMenuContainer} ref={menuRef}>
        <div className={styles.mobileIconButtonWrapper}>
          <button
            onClick={() =>
              setActiveMenu(activeMenu === "hamburger" ? null : "hamburger")
            }
            className={styles.iconButton}
            title="Menu"
            aria-label="Menu"
          >
            <span className="fa fa-bars"></span>
          </button>
          {activeMenu === "hamburger" && (
            <div className={styles.dropdownMenu}>
              {hamburgerMenuItems.map(item => (
                <button
                  key={item.id}
                  className={styles.dropdownItem}
                  onClick={item.onClick}
                >
                  {item.icon && (
                    <span
                      className={`fa ${item.icon} ${styles.dropdownIcon}`}
                    ></span>
                  )}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.mobileIconButtonWrapper}>
          <button
            onClick={() => setActiveMenu(activeMenu === "gear" ? null : "gear")}
            className={styles.iconButton}
            title="Settings"
            aria-label="Settings"
          >
            <span className="fa fa-gear"></span>
          </button>
          {activeMenu === "gear" && (
            <div className={styles.dropdownMenu}>
              {gearMenuItems.map(item => (
                <button
                  key={item.id}
                  className={styles.dropdownItem}
                  onClick={item.onClick}
                >
                  {item.icon && (
                    <span
                      className={`fa ${item.icon} ${styles.dropdownIcon}`}
                    ></span>
                  )}
                  {item.label}
                </button>
              ))}
              {isMobileModeOpen ? (
                <div
                  className={`${styles.modeMenu} ${styles.modeMenuInline}`}
                  role="group"
                  aria-label="App mode"
                >
                  {(["normal", "round-robin"] as const).map(option => (
                    <button
                      key={option}
                      className={styles.modeMenuOption}
                      aria-pressed={mode === option}
                      onClick={() => {
                        setMode(option);
                        setIsMobileModeOpen(false);
                        setActiveMenu(null);
                      }}
                    >
                      {MODE_LABELS[option]}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  className={styles.modeTrigger}
                  onClick={() => setIsMobileModeOpen(true)}
                  aria-haspopup="menu"
                  aria-expanded="false"
                >
                  <span
                    className={`fa fa-sliders ${styles.dropdownIcon}`}
                    aria-hidden="true"
                  ></span>
                  <span className={styles.modeTriggerLabel}>
                    Mode: {MODE_LABELS[mode]}
                  </span>
                  <span
                    className="fa fa-chevron-down"
                    aria-hidden="true"
                  ></span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* name input form */}
      <form
        className={`${styles.nameInputForm} ${isImportMode ? styles.importMode : ""}`}
        onSubmit={handleSubmit}
      >
        {isImportMode ? (
          <textarea
            ref={textareaRef}
            className={styles.nameInput}
            value={importValue}
            onChange={e => setImportValue(e.target.value)}
            placeholder="Enter names, one per line"
            rows={1}
          />
        ) : (
          <input
            type="text"
            className={styles.nameInput}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter a name"
          />
        )}
        <button type="submit" className={styles.addButton} aria-label="Add">
          <span className="fa fa-regular fa-square-plus"></span>
        </button>
      </form>

      {!isImportMode && <NameList />}
    </div>
  );
};

export default Controls;
