import $ from "jquery";
import Wheel from "./wheel";

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

function updateWheel(): void {
  const checkedNames = $('input[type="checkbox"]:checked').map(function() {
    return $(this).val() as string;
  }).get();

  if (Wheel.self) {
    Wheel.self.names = checkedNames.randomize();
    Wheel.self.init();
  } else {
    new Wheel(checkedNames.randomize()).init();
  }
}

function removeName(name: string): void {
  $(`input[type="checkbox"][value="${name}"]`).parent().remove();
  updateWheel();
}

function addName(): void {
  const name = prompt("Enter a new name:");
  if (name) {
    const $list = $('#people ul');
    const index = $list.find('li').length;

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
    var $deleteButton = $('<button class="delete-button">-</button>');
    $deleteButton.on('click', () => removeName(name));

    $li.append($checkbox).append($label).append($deleteButton);
    $list.append($li);

    $('input[type="checkbox"]').off('change').on('change', updateWheel);
    updateWheel();
  }
}

function saveNames(names: string[]): void {
  var $list = $('#people ul').empty();

  names.forEach((name, index) => {
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
    var $deleteButton = $('<button class="delete-button">-</button>');
    $deleteButton.on('click', () => removeName(name));

    $li.append($checkbox).append($label).append($deleteButton);
    $list.append($li);
  });

  $('input[type="checkbox"]').on('change', updateWheel);
  $('#people').show();
  updateWheel();
}

export { loadNamesFromUrl, shareUrl, saveNames, darkModeToggler, addName };
