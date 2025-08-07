/** @format */

"use strict";

const openApp = () => {
  setTimeout(() => {
    initMenu();
    wnds.init();
    getTheme();
    imageCarousel();
    showSommario();
  }, 100);
};

const opHome = (e) => {
  showSommario();
  toggleMenu();
  UaWindowAdm.closeAll();
};

const opArchivio = (e) => {
  showIndici();
  toggleMenu();
  UaWindowAdm.closeAll();
};

const opHelp = () => {
  toggleMenu();
  UaWindowAdm.closeAll();
  wnds.wdiv.open("./html/help0.html");
};

const opNews = (e) => {
  toggleMenu();
  UaWindowAdm.closeAll();
  wnds.wdiv.open("./html/help1.html");
};

const opRedazione = (e) => {
  toggleMenu();
  UaWindowAdm.closeAll();
  wnds.wdiv.open("./html/redazione.html");
  // wnds.wdiv.open("./html/redazione_0.html");
};

const opCollaboatori = (e) => {
  toggleMenu();
  UaWindowAdm.closeAll();
  wnds.wdiv.open("./html/collaboratori.html");
};

const opIPOTESI = (e) => {
  alert("IPOTESI");
};

const opIPubblicita = (e) => {
  alert("pubblicita");
  // imageCarousel();
};

const op9 = async (e) => {
  alert("op0");
};

const op10 = async (e) => {
  alert("op10");
};

////////////////////////////

const initMenu = () => {
  document.body.classList.add("theme-light");
  const menu_h = document.querySelector(".menu-h");
  menu_h.addEventListener("click", toggleMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu_h.classList.contains("active")) {
      toggleMenu();
    }
  });

  document.getElementById("btn-dark-theme").addEventListener("click", setDark);
  document.getElementById("btn-light-theme").addEventListener("click", setLight);
  document.getElementById("btn-help").addEventListener("click", opHelp);
  document.getElementById("btn-home").addEventListener("click", opHome);
  document.getElementById("btn-archivio").addEventListener("click", opArchivio);
  document.getElementById("btn-redazione").addEventListener("click", opRedazione);
  document.getElementById("btn-collaboratori").addEventListener("click", opCollaboatori);
};

const toggleMenu = () => {
  const menu_h = document.querySelector(".menu-h");
  menu_h.classList.toggle("active");
  document.body.classList.toggle("open-menu");

  const menu_hb = document.querySelector(".menu-h-box");
  if (menu_h.classList.contains("active")) menu_hb.setAttribute("data-tt", "Close");
  else menu_hb.setAttribute("data-tt", "Open");
};

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

const invertColors = () => {
  const elements = document.querySelectorAll("*");
  elements.forEach((element) => {
    element.classList.add("invert-colors");
  });
};

const enableEsc = (event) => {
  document.addEventListener("keydown", cmdEsc);
  if (!event) return;
  if (event.key === "Escape" || event.keyCode === 27) {
    cmdEsc();
  }
};

const disableEsc = (event) => {
  document.removeEventListener("keydown", cmdEsc);
};

const cmdEsc = () => {
  closeReader();
};
// //////////////

const imageCarousel = () => {
  const parentContainer = document.querySelector(".col-right");
  const imageContainers = parentContainer.querySelectorAll(".item0");
  imageContainers.forEach((container) => {
    container.classList.add("active");
  });
  const rotateImages = () => {
    const firstItem = parentContainer.querySelector(".item0");
    parentContainer.appendChild(firstItem);
  };
  // AAA setInterval(rotateImages, 5000);
};

// Call the function to start the carousel
// imageCarousel();
