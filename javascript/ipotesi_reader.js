/** @format */

import { HttpService } from "./ipotesi_http.js";
import { tts } from "./ipotesi_speak.js";
import { UaWindowAdm } from "./uawindow.js";
import { EventManager } from "./event_manager.js";

class Reader {
  constructor() {
    this.fontSize = 16;
    this.fsizeDef = 16;
    this.fsizeMax = 32;
    this.fsizeMin = 14;
    this.fsizeKey = "fsize_reader_v2";
    this.textCurrent = "";
    this.urlCurrent = "";
    this.isReaderOpen = false;

    // Registra gli handler degli eventi una sola volta
    this.registerEventHandlers();
  }

  registerEventHandlers() {
    EventManager.on("click", "#btn-read-html", () => this.readHtml());
    EventManager.on("click", "#btn-back-reader", () => this.closeReader());
    EventManager.on("click", "#btn-toggle-speak", () => tts.toggleSpeak());
    EventManager.on("click", "#btn-toggle-reading", () => tts.toggleReading(this.textCurrent));
    EventManager.on("click", "#btn-fullscreen", () => this.openFullscreen());

    // Gestione centralizzata del tasto ESC
    EventManager.on("keydown", "body", (e) => {
        if (e.key === "Escape" && this.isReaderOpen) {
            this.closeReader();
        }
    });
  }

  fh(txt) {
    const content = txt;
    const result = `
        <div class="text-reader" id="reader">
            <div class="toolbar">
                <button id="btn-back-reader" class="tt-right btn-back-reader" data-tt="Chiudi (Esc)">⬅ (Esc)</button>
                <button id="btn-read-html" class="tt-bottom btn-cmd-text" data-tt="Apri Articolo sul Web">Art.Web.</button>
                <button id="btn-toggle-speak" class="tt-bottom" data-tt="Configura lettore">⚙️</button>
                <button id="btn-toggle-reading" class="tt-bottom" data-tt="Start/Sop lettore">▶</button>
                <button id="btn-fullscreen" class="tt-left" data-tt="Apri/Chiudi Schermo Intero">⛶</button>
            </div>
            <div class="content" id="content">
            ${content}
            </div>
        </div>
`;
    return result;
  }

  showReader(text) {
    this.textCurrent = text;
    const h = this.fh(text);
    const w = UaWindowAdm.create("id_reader");
    w.setZ(12);
    w.vw_vh().setXY(0.1, 10.2, -1);
    w.setHtml(h);
    w.show();
    this.defaultFontSize();
  }

  openReader(url) {
    this.urlCurrent = url;
    HttpService.fetchText(url, (text) => this.showReader(text));
    this.isReaderOpen = true;
  }

  // Apre la pagina isolata dell'articolo (art/...).
  readHtml() {
    if (!this.urlCurrent) {
      console.error("readHtml: urlCurrent mancante");
      return;
    }
    const pagePath = this.urlCurrent.replace("data/", "art/");
    window.open(pagePath, "_blank");
  }

  closeReader() {
    if (!this.isReaderOpen) return;
    
    this.isReaderOpen = false;
    tts.closeSpeak();
    tts.stopReading();
    UaWindowAdm.close("id_reader");

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
  }

  defaultFontSize() {
    const s = localStorage.getItem(this.fsizeKey);
    let v = parseInt(s, 10);
    if (isNaN(v)) v = this.fsizeDef;
    this.fontSize = v;
    const content = document.getElementById("content");
    if(content) content.style.fontSize = `${this.fontSize}px`;
  }

  openFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error(err));
      }
    }
  }
}

export const reader = new Reader();
