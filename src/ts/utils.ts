import $ from "jquery";
import Wheel from "./wheel";

// Stores the names that are currently checked and thus active in the wheel.
let activeNames: string[] = [];
// Stores objects, each containing a name and its current checked state (boolean).
let allNamesWithStates: { name: string; checked: boolean }[] = [];

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

/**
 * Populates the list of names with checkboxes.
 * @param namesArray - Array of names to populate the list with.
 */
export function populateNameList(namesArray: string[]): void {
  $('#people ul').empty();
  activeNames = [];
  allNamesWithStates = [];

  namesArray.forEach((name, index) => {
    const $li = $('<li>');
    const checkboxId = `name_${index}`;
    const $checkbox = $('<input>', {
      type: 'checkbox',
      id: checkboxId,
      name: name,
      value: name,
      checked: true,
    });
    const $label = $('<label>', {
      for: checkboxId,
      text: name,
    });

    activeNames.push(name);
    allNamesWithStates.push({ name: name, checked: true });

    $li.append($checkbox).append($label);
    $('#people ul').append($li);

    // Attach a 'change' event listener to the checkbox
    $checkbox.on('change', (event) => {
      const target = event.target as HTMLInputElement;
      const name = target.value;
      const isChecked = target.checked;

      // Update the corresponding entry in allNamesWithStates
      const nameEntry = allNamesWithStates.find(entry => entry.name === name);
      if (nameEntry) {
        nameEntry.checked = isChecked;
      }

      if (isChecked) {
        // If the checkbox is checked
        // Assuming Wheel.permanentlyRemovedNames is an array, possibly empty.
        // The actual creation of this property is in a future step.
        const permanentlyRemovedNames = (Wheel.self as any).permanentlyRemovedNames || [];
        if (!permanentlyRemovedNames.includes(name)) {
          if (!activeNames.includes(name)) { // Ensure no duplicates
            activeNames.push(name);
          }
        }
      } else {
        // If the checkbox is unchecked
        activeNames = activeNames.filter(activeName => activeName !== name);
      }

      // After updating activeNames, re-initialize the wheel
      Wheel.self.names = [...activeNames].randomize();
      Wheel.self.init();
    });
  });
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
  const inputNames = ($('#people-input').val() as string).split('\n').filter(Boolean);
  populateNameList(inputNames);

  $('#configure-people').hide();
  $('#people').show();

  Wheel.self.names = [...activeNames].randomize(); // Use a copy of activeNames
  Wheel.self.init();
}

function updateNames(): void {
  // Resetting states when user goes back to edit names
  Wheel.permanentlyRemovedNames = [];
  activeNames.length = 0;
  allNamesWithStates.length = 0;

  $("#configure-people").show();
  $("#people").hide();
}

export { loadNamesFromUrl, shareUrl, saveNames, updateNames, darkModeToggler, activeNames, populateNameList };
