/** @format */

import { getTheme, setLight, setDark } from "./ipotesi_theme.js";
import { opHome, opArchivio, opHelp, opRedazione, opCollaboatori } from "./ipotesi_menu.js";
import { wnds, showSommario } from "./ipotesi_ui.js";
// import { reader } from './ipotesi_reader.js';
// import { reader } from './ipotesi_reader.js';

("use strict");

const openApp = () => {
  initMenu();
  wnds.init();
  getTheme();
  imageCarousel();
  showSommario();
};

////////////////////////////

const initMenu = () => {
  document.body.classList.add("theme-light");
  const menu_h = document.querySelector(".menu-h");
  if (menu_h) {
    menu_h.addEventListener("click", toggleMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu_h.classList.contains("active")) {
        toggleMenu();
      }
    });
  }

  const btnDarkTheme = document.getElementById("btn-dark-theme");
  if (btnDarkTheme) btnDarkTheme.addEventListener("click", setDark);

  const btnLightTheme = document.getElementById("btn-light-theme");
  if (btnLightTheme) btnLightTheme.addEventListener("click", setLight);

  const btnHelp = document.getElementById("btn-help");
  if (btnHelp) btnHelp.addEventListener("click", opHelp);

  const btnHome = document.getElementById("btn-home");
  if (btnHome) btnHome.addEventListener("click", opHome);

  const btnArchivio = document.getElementById("btn-archivio");
  if (btnArchivio) btnArchivio.addEventListener("click", opArchivio);

  const btnRedazione = document.getElementById("btn-redazione");
  if (btnRedazione) btnRedazione.addEventListener("click", opRedazione);

  const btnCollaboratori = document.getElementById("btn-collaboratori");
  if (btnCollaboratori) btnCollaboratori.addEventListener("click", opCollaboatori);
};

export const toggleMenu = () => {
  const menu_h = document.querySelector(".menu-h");
  if (!menu_h) return;

  menu_h.classList.toggle("active");
  document.body.classList.toggle("open-menu");

  const menu_hb = document.querySelector(".menu-h-box");
  if (menu_hb) {
    if (menu_h.classList.contains("active")) {
      menu_hb.setAttribute("data-tt", "Close");
    } else {
      menu_hb.setAttribute("data-tt", "Open");
    }
  }
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
  if (!parentContainer) return;

  const imageContainers = parentContainer.querySelectorAll(".item0");
  imageContainers.forEach((container) => {
    container.classList.add("active");
  });

  const rotateImages = () => {
    const firstItem = parentContainer.querySelector(".item0");
    if (firstItem) {
      parentContainer.appendChild(firstItem);
    }
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
    if (versionElement) {
      versionElement.textContent = formatDateTime();
    }
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
