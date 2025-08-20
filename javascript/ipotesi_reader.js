/** @format */

import { HttpService } from "./ipotesi_http.js";
import { tts } from "./ipotesi_speak.js";
import { UaWindowAdm } from "./uawindow.js";
import { EventManager } from "./event_manager.js";

class Reader {
  constructor() {
    this.fontSize = 18;
    this.fsizeDef = 18;
    this.fsizeMax = 32;
    this.fsizeMin = 14;
    this.fsizeKey = "fsize_reader";
    this.textCurrent = "";
    this.urlCurrent = "";
    this.isReaderOpen = false;

    // Registra gli handler degli eventi una sola volta
    this.registerEventHandlers();
  }

  registerEventHandlers() {
    EventManager.on("click", "#btn-read-pdf", () => this.readPDF());
    EventManager.on("click", "#btn-toggle-speak", () => tts.toggleSpeak());
    EventManager.on("click", "#btn-toggle-reading", () => tts.toggleReading(this.textCurrent));
    EventManager.on("click", "#btn-increase-font", () => this.increaseFontSize());
    EventManager.on("click", "#btn-decrease-font", () => this.decreaseFontSize());
    EventManager.on("click", "#btn-fullscreen", () => this.openFullscreen());
    EventManager.on("click", "#btn-close-reader", () => this.closeReader());

    // Gestione centralizzata del tasto ESC
    EventManager.on("keydown", "body", (e) => {
        if (e.key === "Escape" && this.isReaderOpen) {
            this.closeReader();
        }
    });
  }

  fh(txt) {
    return `
        <div class="text-reader" id="reader">
            <div class="toolbar">
                <span>chiudi:(Esc)</span>
                <button id="btn-read-pdf" class="tt-bottom" data-tt="Apri pagina PDF">PDF</button>
                <button id="btn-toggle-speak" class="tt-bottom" data-tt="Configura lettore">⚙️</button>
                <button id="btn-toggle-reading" class="tt-bottom" data-tt="Start/Sop lettore">▶</button>
                <button id="btn-increase-font" class="tt-bottom" data-tt="Font +">A+</button>
                <button id="btn-decrease-font" class="tt-bottom" data-tt="Font -">A-</button>
                <button id="btn-fullscreen" class="tt-left" data-tt="Apri/Chiudi Schermo Intero">⛶</button>
                <button id="btn-close-reader" class="tt-left" data-tt="Chiudi">X</button>
            </div>
            <div class="content" id="content">
            ${txt}
            </div>
        </div>
`;
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

  async readPDF() {
    if (!this.urlCurrent) return;
    const path = this.urlCurrent.replace("data/", "data/pdf/").replace(".html", ".pdf");
    try {
      const arrayBuffer = await HttpService.getPdf(path);
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Errore durante la lettura del PDF:", error);
    }
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

  increaseFontSize() {
    const content = document.getElementById("content");
    if (!content) return;
    this.fontSize = Math.min(this.fontSize + 2, this.fsizeMax);
    content.style.fontSize = `${this.fontSize}px`;
    localStorage.setItem(this.fsizeKey, this.fontSize.toString());
  }

  decreaseFontSize() {
    const content = document.getElementById("content");
    if (!content) return;
    this.fontSize = Math.max(this.fontSize - 2, this.fsizeMin);
    content.style.fontSize = `${this.fontSize}px`;
    localStorage.setItem(this.fsizeKey, this.fontSize.toString());
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
