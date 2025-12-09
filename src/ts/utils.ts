import $ from "jquery";
import Wheel from "./wheel";

declare global {
  interface Array<T> {
    randomize(): Array<T>;
  }
}

function randonInt(max: number): number {
  return Math.floor(Math.random() * max);
}

Array.prototype.randomize = function () {
  // randomize objects
  for (let index = this.length - 1; index >= 1; index--) {
    let randomIndex = randonInt(index);
    let tempValue = this[randomIndex];

    this[randomIndex] = this[index];
    this[index] = tempValue;
  }
  return this;
};

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

function saveNames(): void {
  var $list = $('#people ul').empty();

  const inputNames = $('#people-input').val()!.toString().split('\n').filter(Boolean);
  inputNames.forEach((name, index) => {
    var $li = $('<li>');
    var $checkbox = $('<input>', {
      id: 'name_' + index,
      name: name,
      value: name,
      type: 'checkbox',
      checked: true,
    });
    var $label = $('<label>', {
      for: 'name_' + index,
      text: name
    });

    $li.append($checkbox).append($label);
    $list.append($li);
  });

  $('#configure-people').hide();
  $('#people').show();

  Wheel.self.names = inputNames.randomize();
  Wheel.self.init();
}

function updateNames(): void {
  $("#configure-people").show();
  $("#people").hide();
}

export { loadNamesFromUrl, shareUrl, saveNames, updateNames, darkModeToggler };
