import $ from "jquery";
import "./scss/main.scss";
import Wheel from "./ts/wheel";
import { loadNamesFromUrl, shareUrl, saveNames, updateNames, darkModeToggler, populateNameList, activeNames } from "./ts/utils.ts";

$(document).ready(function() {
  const names = loadNamesFromUrl().randomize();
  if (names.length === 0) {
    for (let i = 1; i <= 6; i++) {
      names.push(`Person ${i}`);
    }
  }

  $("#share").on("click", shareUrl);
  $('#theme-toggle').on("click", darkModeToggler());
  $('#go-button').on("click", saveNames);
  $('#edit-button').on("click", updateNames);

  // Populate the textarea with all names (from URL or default)
  $('#people-input').val(names.join('\n'));

  // Create the visual list with checkboxes and populate activeNames
  populateNameList(names);

  // If names were loaded (e.g., from URL), show the list view directly
  if (names.length > 0) {
    $('#configure-people').hide();
    $('#people').show();
  }

  // Initialize the wheel with the initially active names
  new Wheel([...activeNames].randomize()).init();
});
