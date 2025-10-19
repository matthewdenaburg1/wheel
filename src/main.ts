import $ from "jquery";
import "./scss/main.scss";
import Wheel from "./ts/wheel";
import Person from "./ts/person.ts";
import PersonList from "./ts/person_list.ts";
import { loadNamesFromUrl, shareUrl, darkModeToggler } from "./ts/utils.ts";

$(document).ready(function() {
  const personList = PersonList.fromNames(loadNamesFromUrl());

  const people = personList.people;
  if (people.length === 0) {
    for (let i = 1; i <= 3; i++) {
      people.push(new Person(`Person ${i}`));
    }
  }

  personList.render();

  $("#new-name").on("click", personList.add);
  $("#share").on("click", shareUrl);
  $("#theme-toggle").on("click", darkModeToggler());

  new Wheel();
});
