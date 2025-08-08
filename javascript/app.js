/** @format */

import { getTheme, setLight, setDark } from "./ipotesi_theme.js";
import { opHome, opArchivio, opHelp, opRedazione, opCollaboatori } from "./ipotesi_menu.js";
import { wnds, showSommario } from "./ipotesi_ui.js";
// import { reader } from './ipotesi_reader.js';

import { reader } from './ipotesi_reader.js';

/** @format */

"use strict";

window.reader = reader;

const openApp = () => {
  initMenu();
  wnds.init();
  getTheme();
  imageCarousel();
  showSommario();
};

window.openReaderFromGlobal = (url) => reader.openReader(url);

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

export const toggleMenu = () => {
  const menu_h = document.querySelector(".menu-h");
  menu_h.classList.toggle("active");
  document.body.classList.toggle("open-menu");

  const menu_hb = document.querySelector(".menu-h-box");
  if (menu_h.classList.contains("active")) menu_hb.setAttribute("data-tt", "Close");
  else menu_hb.setAttribute("data-tt", "Open");
};

const invertColors = () => {
  const elements = document.querySelectorAll("*");
  elements.forEach((element) => {
    element.classList.add("invert-colors");
  });
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

document.addEventListener("DOMContentLoaded", () => {
  const versionElement = document.getElementById("id_version");

  const formatDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const updateDateTime = () => {
    versionElement.textContent = formatDateTime();
  };

  const checkCache = () => {
    const version = "v=1.025";
    const today = new Date().toISOString().split("T")[0] + version;
    const cachedDate = localStorage.getItem("appinfo");
    if (cachedDate !== today) {
      localStorage.setItem("appinfo", today);
      console.log("***** Aggiornamento della cache", today);
      window.location.reload(true);
    }
  };
  checkCache();
  updateDateTime();
  openApp();
});
