import $ from "jquery";
import "./scss/main.scss";
import Wheel from "./ts/wheel";
import Person from "./ts/person";
import { loadNamesFromUrl, shareUrl, darkModeToggler } from "./ts/utils.ts";

$(document).ready(function() {
  const people = Person.fromNames(loadNamesFromUrl()).randomize();
  if (people.length === 0) {
    for (let i = 1; i <= 6; i++) {
      people.push(new Person(`Person ${i}`));
    }
  }

  Person.renderAll();

  $("#new-name").on("click", Person.newPerson);
  $("#share").on("click", shareUrl);
  $("#theme-toggle").on("click", darkModeToggler());

  // new Wheel(Person.getPeople()).init();
  new Wheel(Person.getNames()).init();
});
