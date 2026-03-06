export const loadNamesFromUrl = (): string[] => {
  return new URLSearchParams(window.location.search)
    .getAll('name')
    .map(decodeURIComponent);
};

export const shareUrl = (names: string[]): void => {
  const nameParams = names.map(encodeURIComponent).join('&name=');
  const url = new URL(window.location.href);
  url.searchParams.set('name', nameParams);

  const shareableUrl = decodeURIComponent(url.href);

  navigator.clipboard.writeText(shareableUrl).then(
    () => {
      alert('Sharable URL copied to clipboard!');
    },
    () => {
      alert('Failed to copy URL to clipboard.');
    },
  );
};
