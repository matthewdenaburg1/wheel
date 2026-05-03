import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { useTheme } from '../utils/theme';

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
  theme: useTheme,

  spinDuration: 1,
  setSpinDuration: () => {},

  soundEnabled: false,
  setSoundEnabled: () => {},
}

export const SettingsContext = createContext<SettingsContextValue>(settings);
export const usePeople = () => useContext(SettingsContext);
export const usePeopleState = (): [SettingsContextValue, Dispatch<SetStateAction<SettingsContextValue>>] => {
  return useState<SettingsContextValue>(settings);
};
