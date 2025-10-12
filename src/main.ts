import $ from "jquery";
import "./scss/main.scss";
import Wheel from "./ts/wheel";
import Person from "./ts/person";
import { loadNamesFromUrl, shareUrl, saveNames, updateNames, darkModeToggler } from "./ts/utils.ts";

$(document).ready(function() {
  // const names = loadNamesFromUrl().randomize();
  // if (names.length === 0) {
  //   for (let i = 1; i <= 6; i++) {
  //     names.push(`Person ${i}`);
  //   }
  // }
  ['Matthew', 'Andrew'].forEach(name => new Person(name));
  Person.renderAll();
  let names = Person.getNames();

  $("#new-name").on("click", Person.showNewPersonInput);
  $("#share").on("click", shareUrl);
  $("#theme-toggle").on("click", darkModeToggler());
  // $("#people-input").val(names.join('\n'));

  new Wheel(names).init();
});
