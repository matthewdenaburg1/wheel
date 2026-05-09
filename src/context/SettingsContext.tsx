import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { useTheme } from '../utils/theme';
import { DEFAULT_SPIN_DURATION } from '../constants';

interface SettingsContextValue {
  radius?: number;
  setRadius?: Dispatch<SetStateAction<number>>;

  theme: typeof useTheme;

  spinDuration: number;
  setSpinDuration: Dispatch<SetStateAction<number>>;

  soundEnabled: boolean;
  setSoundEnabled: Dispatch<SetStateAction<boolean>>;
}

const settings: SettingsContextValue = {
  radius: 500,
  setRadius: () => {},

  theme: useTheme,

  spinDuration: DEFAULT_SPIN_DURATION,
  setSpinDuration: () => {},

  soundEnabled: false,
  setSoundEnabled: () => {},
}

export const SettingsContext = createContext<SettingsContextValue>(settings);
export const useSettings = () => useContext(SettingsContext);
export const useSettingsState = (): [SettingsContextValue, Dispatch<SetStateAction<SettingsContextValue>>] => {
  return useState<SettingsContextValue>(settings);
};
