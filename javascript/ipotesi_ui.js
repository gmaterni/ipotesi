import { UaWindowAdm } from "./uawindow.js";
import { HttpService } from "./ipotesi_http.js";
import { reader } from "./ipotesi_reader.js";
import { EventManager } from "./event_manager.js";

/** @format */

const WndDiv = (id) => {
  return {
    w: UaWindowAdm.create(id),
    out: null,
    show(s) {
      const fh = (txt) => {
        // Usiamo una classe per il bottone di chiusura invece di un ID per evitare duplicati
        return `
<div class="window-text">
<div class="btn-wrapper">
<button class="btn-close-wnd tt-left" data-tt="chiudi">X</button>
</div>
<div class="div-text">${txt}</div>
</div>
    `;
      };
      wnds.closeAll();
      const h = fh(s);
      this.w.drag();
      this.w.setZ(12);
      this.w.vw_vh().setXY(0, 10, -1);
      this.w.setHtml(h);
      this.w.show();
    },
    close() {
      this.w.close();
    },
    open(url) {
      HttpService.fetchText(url, (s) => this.show(s));
    },
  };
};

export const wnds = {
  wdiv: null,
  init() {
    this.wdiv = WndDiv("id_w0");
    // Gestiamo la chiusura delle finestre tramite EventManager
    EventManager.on("click", ".btn-close-wnd", (e, target) => {
        const windowElement = target.closest('[data-name="ua-window"]');
        if (windowElement) {
            UaWindowAdm.close(windowElement.id);
        }
    });
  },
  closeAll() {
    UaWindowAdm.close("id_w0");
  },
};

const handleContentClick = (event, target) => {
  event.preventDefault();
  const url = target.dataset.url;
  if (url) {
    reader.openReader(url);
  }
};

const loadContent = (url, element) => {
  if (!element) return;
  HttpService.fetchText(url, (html) => {
    element.innerHTML = html;
  });
};

export const showSommario = function () {
  const item1 = document.getElementById("id_item1");
  if (item1) {
    loadContent("./data/indice.html", item1);
  }
};

export const showIndici = function () {
  const item1 = document.getElementById("id_item1");
  if (item1) {
    loadContent("./data/archivio.html", item1);
  }
};

// Registra il gestore di eventi una sola volta all'inizializzazione del modulo
EventManager.on("click", "#id_item1 a[data-url]", handleContentClick);
