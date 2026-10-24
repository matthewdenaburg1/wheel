import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction
} from "react";

export type AppMode = "normal" | "round-robin";

interface AppModeContextValue {
  mode: AppMode;
  setMode: Dispatch<SetStateAction<AppMode>>;
}

const AppModeContext = createContext<AppModeContextValue>({
  mode: "normal",
  setMode: () => {}
});

export const useAppMode = () => useContext(AppModeContext);

export const useAppModeState = (): [
  AppMode,
  Dispatch<SetStateAction<AppMode>>
] => {
  const [mode, setMode] = useState<AppMode>(() => {
    const saved = localStorage.getItem("appMode");
    return saved === "round-robin" || saved === "normal" ? saved : "normal";
  });

  useEffect(() => {
    localStorage.setItem("appMode", mode);
  }, [mode]);

  return [mode, setMode];
};

export { AppModeContext };
