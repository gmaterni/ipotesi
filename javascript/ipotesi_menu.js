/** @format */

"use strict";

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
