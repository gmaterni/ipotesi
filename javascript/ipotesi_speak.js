/** @format */
"use strict";

function toggleReading() {
  tts.toggleReading();
}

function stopReading() {
  tts.stopReading();
}

function closeSpeak() {
  tts.closeSpeak();
}

function toggleSpeak() {
  tts.toggleSpeak();
}

function saveSpeak() {
  tts.saveSpeak();
}
///////////////////////

class TextToSpeech {
  constructor() {
    this.isReading = false;
    this.panel = false;
  }

  openSpeak() {
    const fhPanel = () => {
      return `
      <div id="configPanel" class="panel-speak">
      <div class="toolbar">
        <button  onclick="saveSpeak()">Salva</button>
        <button  onclick="closeSpeak()">X</button>
      </div>
      <div id="id_voices">
        <p>Volume:<input type="range" name="amplitude" min="0" max="1" step="0.1" value="1"></p>
        <p>Tono:<input type="range" name="pitch" min="0" max="2" step="0.1" value="1"></p>
        <p>Velocità:<input type="range" name="speed" min="0.5" max="2" step="0.1" value="1"></p>
        </div>
      </div>
      `;
    };

    const jfh = UaJtfh();
    jfh.init();
    const html = fhPanel();
    const w = UaWindowAdm.create("id_speak");
    w.setZ(1000);
    w.vw_vh().setXY(30, 50, -1);
    w.setHtml(html);
    w.show();
    w.drag();
    this.setSpeak();
    this.panel = true;
  }

  closeSpeak() {
    this.saveSpeak();
    UaWindowAdm.close("id_speak");
    this.panel = false;
  }

  toggleSpeak() {
    if (this.panel) {
      this.closeSpeak();
    } else {
      this.openSpeak();
    }
  }

  setSpeak() {
    const js = this.loadSettings();
    const w = document.getElementById("id_voices");
    w.querySelector('[name="amplitude"]').value = js.amplitude;
    w.querySelector('[name="pitch"]').value = js.pitch;
    w.querySelector('[name="speed"]').value = js.speed;
  }

  saveSpeak() {
    const w = document.getElementById("id_voices");
    if (!w) return;
    const amplitude = w.querySelector('[name="amplitude"]').value; //volumE
    const pitch = w.querySelector('[name="pitch"]').value; //tono
    const speed = w.querySelector('[name="speed"]').value; //rate
    this.saveSettings(amplitude, pitch, speed);
  }

  saveSettings(amplitude, pitch, speed) {
    localStorage.setItem("amplitude", amplitude);
    localStorage.setItem("pitch", pitch);
    localStorage.setItem("speed", speed);
  }

  loadSettings() {
    const js = {};
    js["amplitude"] = localStorage.getItem("amplitude") || 1;
    js["pitch"] = localStorage.getItem("pitch") || 1;
    js["speed"] = localStorage.getItem("speed") || 1;
    for (let key in js) {
      if (js[key] === "undefined") {
        js[key] = "1";
      }
    }
    return js;
  }

  stopReading() {
    if (this.isReading) {
      document.getElementById("readButton").innerText = "▶";
      window.speechSynthesis.cancel();
      this.isReading = false;
    }
  }

  toggleReading() {
    // #XXX
    // Se la lettura è già in corso, la fermiamo.
    if (this.isReading) {
      this.stopReading();
    } else {
      // Altrimenti, iniziamo la lettura.
      const readButton = document.getElementById("readButton");
      readButton.innerText = "⏸"; // Aggiorniamo l'icona del pulsante a "pausa".
      this.isReading = true; // Impostiamo lo stato di lettura a "in corso".

      // Carichiamo le impostazioni vocali (volume, tono, velocità).
      const js = this.loadSettings();
      // Puliamo il testo da leggere da tag HTML e altri caratteri non necessari.
      const text = this.cleanupText(textCurrent);
      // Creiamo un nuovo oggetto per la sintesi vocale.
      const ssu = new SpeechSynthesisUtterance(text);

      // Applichiamo le impostazioni all'oggetto di sintesi vocale.
      ssu.volume = js.amplitude;
      ssu.rate = js.speed;
      ssu.pitch = js.pitch;
      ssu.lang = "it-IT"; // Impostiamo la lingua.

      // Definiamo una funzione per resettare lo stato dell'interfaccia.
      const resetState = () => {
        this.isReading = false;
        readButton.innerText = "▶"; // Reimpostiamo l'icona del pulsante a "play".
      };

      // Assegniamo la funzione `resetState` all'evento `onend`.
      // Questo evento viene chiamato automaticamente quando la sintesi vocale termina.
      ssu.onend = resetState;

      // Assegniamo una funzione di gestione all'evento `onerror`.
      // Questo evento viene chiamato se si verifica un errore durante la sintesi.
      ssu.onerror = (event) => {
        console.error("Errore nella sintesi vocale:", event.error);
        resetState(); // Resettiamo lo stato anche in caso di errore.
      };

      // Avviamo la sintesi vocale.
      window.speechSynthesis.speak(ssu);
    }
  }

  cleanupText(text) {
    return text
      .replace(/<[^>]+>/g, "")
      .replace(/&[^;]+;/g, "")
      .replace(/[#@*]/g, "");
  }
}

const tts = new TextToSpeech();
