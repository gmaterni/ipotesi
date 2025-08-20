/** @format */
 
"use strict";

import { showSommario, showIndici, wnds } from "./ipotesi_ui.js";
import { UaWindowAdm } from "./uawindow.js";

export const toggleMenu = () => {
  const menu_h = document.querySelector(".menu-h");
  if (!menu_h) return;

  menu_h.classList.toggle("active");
  document.body.classList.toggle("open-menu");

  if (menu_h.classList.contains("active")) {
    menu_h.setAttribute("data-tt", "Close");
  } else {
    menu_h.setAttribute("data-tt", "Open");
  }
};


export const opHome = (e) => {
  showSommario();
  toggleMenu();
  UaWindowAdm.closeAll();
};

export const opArchivio = (e) => {
  showIndici();
  toggleMenu();
  UaWindowAdm.closeAll();
};

export const opHelp = () => {
  toggleMenu();
  UaWindowAdm.closeAll();
  wnds.wdiv.open("./html/help0.html");
};

export const opRedazione = () => {
  toggleMenu();
  UaWindowAdm.closeAll();
  wnds.wdiv.open("./html/redazione.html");
};

export const opCollaboatori = (e) => {
  toggleMenu();
  UaWindowAdm.closeAll();
  wnds.wdiv.open("./html/collaboratori.html");
};

export const opIPOTESI = (e) => {
  alert("IPOTESI");
};

// AAA opIPubblicita
// const opIPubblicita = (e) => {
//   alert("pubblicita");
//   // imageCarousel();
// };

// export const op9 = async (e) => {
//   alert("op0");
// };

// export const op10 = async (e) => {
//   alert("op10");
// };
