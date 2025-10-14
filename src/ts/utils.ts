import $ from "jquery";

declare global {
  interface Array<T> {
    randomize(): Array<T>;
  }
}

Array.prototype.randomize = function() {
  // randomize objects
  return this.sort(() => Math.random() - 0.5);
}

/**
 * Toggles between light and dark mode
 */
function darkModeToggler() {
  const darkThemeClass = 'dark-mode';
  const lightThemeClass = 'light-mode';

  /**
   * Apply the dark theme class to the body
   */
  function applyDarkMode() {
    $('body').addClass(darkThemeClass);
    localStorage.setItem('theme', darkThemeClass);
  }

  /**
   * Remove the dark theme class from the body
   */
  function removeDarkMode() {
    $('body').removeClass(darkThemeClass);
    localStorage.setItem('theme', lightThemeClass);
  }

  /**
   * Function to toggle dark mode
   */
  function toggleDarkMode() {
    if ($('body').hasClass(darkThemeClass)) {
      removeDarkMode();
    } else {
      applyDarkMode();
    }
  }

  // Check for a saved user preference, and apply it
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    if (savedTheme === darkThemeClass) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
  }
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // If no saved preference, apply system preference
    applyDarkMode();
  }
  else {
    // still nothing, apply dark theme
    applyDarkMode()
  }

  return toggleDarkMode;
}

function loadNamesFromUrl(): Array<string> {
  return new URLSearchParams(window.location.search)
    .getAll("name")
    .map(decodeURIComponent);
}

function shareUrl(): void {
  const names = $('#people-input')
    .val()!
    .toString()
    .split('\n')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('&name=');

  const url = new URL(window.location.href);
  url.searchParams.set('name', names);

  const shareableUrl = decodeURIComponent(url.href);

  navigator.clipboard.writeText(shareableUrl).then(
    function() {
      alert("Sharable URL copied to clipboard!");
    },
    function() {
      alert("Failed to copy URL to clipboard.");
    });
}

export { loadNamesFromUrl, shareUrl, darkModeToggler };
