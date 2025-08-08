/** @format */

"use strict";

import { showSommario, showIndici, wnds } from "./ipotesi_ui.js";
import { toggleMenu } from "./app.js";
import { UaWindowAdm } from "./uawindow.js";

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

// AAA news
// const opNews = () => {
//   toggleMenu();
//   UaWindowAdm.closeAll();
//   wnds.wdiv.open("./html/help1.html");
// };

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
