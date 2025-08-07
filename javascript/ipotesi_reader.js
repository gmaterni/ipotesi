class Reader {
  constructor() {
    this.fontSize = 18;
    this.fsizeDef = 18;
    this.fsizeMax = 32;
    this.fsizeMin = 14;
    this.fsizeKey = "fsize_reader";
    this.textCurrent = "";
    this.urlCurrent = "";
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
    const s = text;
    const h = this.fh(s);
    const w = UaWindowAdm.create("id_reader");
    w.setZ(12);
    w.vw_vh().setXY(0.1, 10.2, -1);
    w.setHtml(h);
    w.show();
    this.defaultFontSize();

    document.getElementById("btn-read-pdf").addEventListener("click", () => this.readPDF());
    document.getElementById("btn-toggle-speak").addEventListener("click", () => toggleSpeak());
    document.getElementById("btn-toggle-reading").addEventListener("click", () => toggleReading(this.textCurrent));
    document.getElementById("btn-increase-font").addEventListener("click", () => this.increaseFontSize());
    document.getElementById("btn-decrease-font").addEventListener("click", () => this.decreaseFontSize());
    document.getElementById("btn-fullscreen").addEventListener("click", () => this.openFullscreen());
    document.getElementById("btn-close-reader").addEventListener("click", () => this.closeReader());
  }

  openReader(url) {
    this.urlCurrent = url;
    HttpService.fetchText(url, (text) => this.showReader(text));
    enableEsc();
  }

  async readPDF() {
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
    disableEsc();
    closeSpeak();
    stopReading();
    UaWindowAdm.close("id_reader");
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  defaultFontSize() {
    const s = localStorage.getItem(this.fsizeKey);
    let v = parseInt(s, 10);
    if (isNaN(v)) v = this.fsizeDef;
    this.fontSize = v;
    const content = document.getElementById("content");
    content.style.fontSize = `${this.fontSize}px`;
  }

  increaseFontSize() {
    const content = document.getElementById("content");
    this.fontSize = Math.min(this.fontSize + 2, this.fsizeMax);
    content.style.fontSize = `${this.fontSize}px`;
    const s = this.fontSize.toString();
    localStorage.setItem(this.fsizeKey, s);
  }

  decreaseFontSize() {
    const content = document.getElementById("content");
    this.fontSize = Math.max(this.fontSize - 2, this.fsizeMin);
    content.style.fontSize = `${this.fontSize}px`;
    const s = this.fontSize.toString();
    localStorage.setItem(this.fsizeKey, s);
  }

  openFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
}

const reader = new Reader();

const enableEsc = (event) => {
  document.addEventListener("keydown", cmdEsc);
  if (!event) return;
  if (event.key === "Escape" || event.keyCode === 27) {
    cmdEsc();
  }
};

const disableEsc = (event) => {
  document.removeEventListener("keydown", cmdEsc);
};

const cmdEsc = () => {
  reader.closeReader();
};
