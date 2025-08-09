import { UaWindowAdm } from "./uawindow.js";
import { HttpService } from "./ipotesi_http.js";
import { reader } from "./ipotesi_reader.js";

/** @format */

const WndDiv = (id) => {
  return {
    w: UaWindowAdm.create(id),
    out: null,
    show(s) {
      const fh = (txt) => {
        return `
<div class="window-text">
<div class="btn-wrapper">
<button id="btn-close-wnd" class="tt-left" data-tt="chiudi">X</button>
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

      const btnClose = document.getElementById("btn-close-wnd");
      if (btnClose) {
        btnClose.addEventListener("click", () => UaWindowAdm.closeThis(this.w.getElement()));
      }
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
  // wpre: null,
  init() {
    this.wdiv = WndDiv("id_w0");
    // this.wpre = WndPre("id_w1");
  },
  closeAll() {
    UaWindowAdm.close("id_w0");
    // UaWindowAdm.close("id_w1");
  },
};

const handleContentClick = (event) => {
  const anchor = event.target.closest("a[data-url]");
  if (anchor) {
    event.preventDefault();
    const url = anchor.dataset.url;
    if (url) {
      reader.openReader(url);
    }
  }
};

const loadContent = (url, element) => {
  if (!element) return;
  const fn = (html) => {
    element.innerHTML = html;
  };
  HttpService.fetchText(url, fn);
};

export const showSommario = function () {
  const item1 = document.getElementById("id_item1");
  if (item1) {
    item1.removeEventListener("click", handleContentClick); // Rimuovi listener precedente se esiste
    item1.addEventListener("click", handleContentClick);
    loadContent("./data/indice.html", item1);
  }
};

export const showIndici = function () {
  const item1 = document.getElementById("id_item1");
  if (item1) {
    item1.removeEventListener("click", handleContentClick); // Rimuovi listener precedente se esiste
    item1.addEventListener("click", handleContentClick);
    loadContent("./data/archivio.html", item1);
  }
};