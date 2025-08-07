/** @format */

"use strict";

const getTheme = () => {
  const t = localStorage.getItem("theme");
  if (!!t && t == "dark") setDark();
};

const setLight = () => {
  document.body.classList.remove("theme-dark");
  document.body.classList.add("theme-light");
  localStorage.setItem("theme", "light");
};

const setDark = () => {
  document.body.classList.remove("theme-light");
  document.body.classList.add("theme-dark");
  localStorage.setItem("theme", "dark");
};
