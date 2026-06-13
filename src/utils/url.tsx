import { DEFAULT_SPIN_DURATION } from '../constants';
import { isTheme, Theme } from './theme';

export interface UrlParams {
  names: string[];
  theme: Theme;
  spinDuration: number;
  soundEnabled: boolean;
}

/**
 * Parse URL search params into structured app state.
 *
 * Names: ?name= is repeatable (one name per param); ?names= is comma-separated
 * (only the first occurrence is used). Both may be mixed; ?name= values come
 * first, followed by ?names= values.
 *
 * Theme: last ?theme= value wins; accepts "light" or "dark"; default "dark".
 * Spin duration: ?spin-for= integer 1–20; default 3.
 * Sound: ?sound=on → true; absent or any other value → false.
 */
export const parseUrlParams = (): UrlParams => {
  const params = new URLSearchParams(window.location.search);

  const singleNames = params.getAll('name');
  const bulkNamesRaw = params.get('names');
  const bulkNames = bulkNamesRaw
    ? bulkNamesRaw.split(',').map((n) => n.trim()).filter((n) => n.length > 0)
    : [];
  const names = [...singleNames, ...bulkNames];

  const theme: Theme = (params.getAll('theme').reverse() as Theme[])
    .find((value) => isTheme(value)) || 'dark';

  const spinForRaw = params.get('spin-for');
  const spinForParsed = spinForRaw !== null ? parseInt(spinForRaw, 10) : NaN;
  const spinDuration =
    !isNaN(spinForParsed) && spinForParsed >= 1 && spinForParsed <= 20
      ? spinForParsed
      : DEFAULT_SPIN_DURATION;

  const soundEnabled = params.get('sound') === 'on';

  return { names, theme, spinDuration, soundEnabled };
};

/**
 * Build and copy a shareable URL to the clipboard.
 * Names are encoded as a single ?names= comma-separated param.
 * Theme is "light" or "dark". Sound is omitted when off.
 */
export const copyShareUrl = (
  names: string[],
  theme: Theme = 'dark',
  spinDuration: number = DEFAULT_SPIN_DURATION,
  // soundEnabled?: boolean,
): void => {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('names', names.join(','));
  url.searchParams.set('theme', theme);
  url.searchParams.set('spin-for', String(spinDuration));
  // if (soundEnabled || soundEnabled === undefined) {
  //   url.searchParams.set('sound', 'on');
  // }

  // Decode for human-readable commas in the URL
  navigator.clipboard.writeText(decodeURIComponent(url.href)).then(
    () => { alert('Sharable URL copied to clipboard!'); },
    () => { alert('Failed to copy URL to clipboard.'); },
  );
};
