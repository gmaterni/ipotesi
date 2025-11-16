/** @format */
"use strict";

import { getTheme, setLight, setDark } from "./ipotesi_theme.js";
import { toggleMenu, opHome, opArchivio, opHelp, opRedazione, opCollaboatori } from "./ipotesi_menu.js";
import { wnds, showSommario } from "./ipotesi_ui.js";
import { tts } from "./ipotesi_speak.js";
import { EventManager } from "./event_manager.js";
// import { initUsageTracker } from './usage_tracker.mjs';
// initUsageTracker();

const initMenu = () => {
  document.body.classList.add("theme-light");

  EventManager.on("click", ".menu-h", toggleMenu);
  EventManager.on("click", "#btn-dark-theme", setDark);
  EventManager.on("click", "#btn-light-theme", setLight);
  EventManager.on("click", "#btn-help", opHelp);
  EventManager.on("click", "#btn-home", opHome);
  EventManager.on("click", "#btn-archivio", opArchivio);
  EventManager.on("click", "#btn-redazione", opRedazione);
  EventManager.on("click", "#btn-collaboratori", opCollaboatori);

  EventManager.on("keydown", "body", (e) => {
    const menu_h = document.querySelector(".menu-h");
    if (e.key === "Escape" && menu_h && menu_h.classList.contains("active")) {
      toggleMenu();
    }
  });
};

const updateVersionAndDate = () => {
  const appScript = document.getElementById("app-script");
  const appVersion = appScript ? appScript.src.split("?v=")[1] || 'N/A' : 'N/A';
  window.APP_VERSION = appVersion;
  console.log(`App Version: ${window.APP_VERSION}`);

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const versionElement = document.getElementById("id_version");
  if (versionElement) {
    // versionElement.textContent = `${appVersion}-${formattedDate}`;
    versionElement.textContent = `${appVersion}`;
  }
};

const openApp = () => {
  initMenu();
  wnds.init();
  tts.init();
  getTheme();
  showSommario();
  updateVersionAndDate();
};

// L'evento DOMContentLoaded non ha bisogno di EventManager, è un evento di inizializzazione una tantum.
document.addEventListener("DOMContentLoaded", openApp);
