/** @format */
"use strict";

import { getTheme, setLight, setDark } from "./ipotesi_theme.js";
import { toggleMenu,opHome, opArchivio, opHelp, opRedazione, opCollaboatori } from "./ipotesi_menu.js";
import { wnds, showSommario } from "./ipotesi_ui.js";
import { tts } from "./ipotesi_speak.js";


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

const updateDateTime = () => {
  const formatDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const versione = document.getElementById("id_version");
  versione.textContent = formatDateTime();
};

const getAppVersion=()=>{
  const appScript = document.getElementById("app-script");
  const appVersion = appScript.src.split("?v=")[1];
  window.APP_VERSION = appVersion;
  console.log(window.APP_VERSION);
}
const openApp = () => {
  initMenu();
  wnds.init();
  tts.init();
  getTheme();
  showSommario();
  updateDateTime();
  getAppVersion();
};

document.addEventListener("DOMContentLoaded", () => {
  openApp();
});
