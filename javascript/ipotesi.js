/** @format */

"use strict";

function openApp() {
  setTimeout(() => {
    initMenu();
    wnds.init();
    MgrIndici.init();
  }, 10);
}

const op1 = function (e) {
  MgrIndici.showIndice();
  toggleMenu();
};

const op2 = function (e) {
  MgrIndici.showIndici();
  toggleMenu();
};

const op3 = async function (e) {
  wnds.wpre.open("./html/help1.html");
};

const op4 = async function (e) {
  wnds.wdiv.open("./html/help0.html");
};

const op5 = async function (e) {
  alert("op5");
};

const op6 = async function (e) {
  alert("op6");
};

const op7 = async function (e) {
  alert("op7");
};

const op8 = async function (e) {
  alert("op8");
};

const op9 = async function (e) {
  alert("op0");
};

const op10 = async function (e) {
  alert("op10");
};

////////////////////////////

function initMenu() {
  document.body.classList.add("theme-dark");
  const menu_h = document.querySelector(".menu-h");
  menu_h.addEventListener("click", toggleMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu_h.classList.contains("active")) {
      toggleMenu();
    }
  });
}

function toggleMenu() {
  const menu_h = document.querySelector(".menu-h");
  menu_h.classList.toggle("active");
  document.body.classList.toggle("open-menu");
}

function setLight() {
  document.body.classList.remove("theme-dark");
  document.body.classList.add("theme-light");
}

function setDark() {
  document.body.classList.remove("theme-light");
  document.body.classList.add("theme-dark");
}
