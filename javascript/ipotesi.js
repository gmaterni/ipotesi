/** @format */

"use strict";

function openApp() {
  setTimeout(() => {
    initMenu();
    wnds.init();
    getTheme();
    imageCarousel();
    showSommario();
  }, 100);
}

const opHome = function (e) {
  showSommario();
  toggleMenu();
  UaWindowAdm.closeAll();
};

const opArchivio = function (e) {
  showIndici();
  toggleMenu();
  UaWindowAdm.closeAll();
};

const opHelp = function () {
  toggleMenu();
  UaWindowAdm.closeAll();
  wnds.wdiv.open("./html/help0.html");
};

const opNews = function (e) {
  toggleMenu();
  UaWindowAdm.closeAll();
  wnds.wdiv.open("./html/help1.html");
};

const opRedazione = function (e) {
  toggleMenu();
  UaWindowAdm.closeAll();
  wnds.wdiv.open("./html/redazione.html");
  // wnds.wdiv.open("./html/redazione_0.html");
};

const opCollaboatori = function (e) {
  toggleMenu();
  UaWindowAdm.closeAll();
  wnds.wdiv.open("./html/collaboratori.html");
};

const opIPOTESI = function (e) {
  alert("IPOTESI");
};

const opIPubblicita = function (e) {
  alert("pubblicita");
  // imageCarousel();
};

const op9 = async function (e) {
  alert("op0");
};

const op10 = async function (e) {
  alert("op10");
};

////////////////////////////

function initMenu() {
  document.body.classList.add("theme-light");
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

  const menu_hb = document.querySelector(".menu-h-box");
  if (menu_h.classList.contains("active")) menu_hb.setAttribute("data-tt", "Close");
  else menu_hb.setAttribute("data-tt", "Open");
}

function getTheme() {
  const t = localStorage.getItem("theme");
  if (!!t && t == "dark") setDark();
}

function setLight() {
  document.documentElement.classList.toggle("invert");
  document.body.classList.remove("theme-dark");
  document.body.classList.add("theme-light");
  localStorage.setItem("theme", "ligth");
}

function setDark() {
  document.documentElement.classList.toggle("invert");
  document.body.classList.remove("theme-light");
  document.body.classList.add("theme-dark");
  localStorage.setItem("theme", "dark");
}

function invertColors() {
  const elements = document.querySelectorAll("*");
  elements.forEach((element) => {
    element.classList.add("invert-colors");
  });
}

function enableEsc(event) {
  document.addEventListener("keydown", cmdEsc);
  if (!event) return;
  if (event.key === "Escape" || event.keyCode === 27) {
    cmdEsc();
  }
}

function disableEsc(event) {
  document.removeEventListener("keydown", cmdEsc);
}

function cmdEsc() {
  closeReader();
}
// //////////////

const imageCarousel = () => {
  // Get parent container
  const parentContainer = document.querySelector(".col-right");
  // Initially show all images
  const imageContainers = parentContainer.querySelectorAll(".item0");
  imageContainers.forEach((container) => {
    container.classList.add("active");
  });
  const rotateImages = () => {
    // Get the first item
    const firstItem = parentContainer.querySelector(".item0");
    // Move it to the end
    parentContainer.appendChild(firstItem);
  };
  // Rotate images every 10 seconds
  setInterval(rotateImages, 5000);
};

// Call the function to start the carousel
// imageCarousel();
