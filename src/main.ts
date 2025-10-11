import $ from "jquery";
import "./scss/main.scss";
import { loadNamesFromUrl, shareUrl, saveNames, darkModeToggler, addName } from "./ts/utils.ts";

$(document).ready(function() {
  const names = loadNamesFromUrl();
  if (names.length === 0) {
    for (let i = 1; i <= 6; i++) {
      names.push(`Person ${i}`);
    }
  }

  $("#share").on("click", shareUrl);
  $('#theme-toggle').on("click", darkModeToggler());
  $('#add-button').on('click', addName);

  saveNames(names);
});
