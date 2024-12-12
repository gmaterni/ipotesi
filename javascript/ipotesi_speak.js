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
    if (this.isReading) {
      document.getElementById("readButton").innerText = "▶";
      window.speechSynthesis.cancel();
      this.isReading = false;
    } else {
      document.getElementById("readButton").innerText = "⏸";
      const js = this.loadSettings();
      const text = this.cleanupText(textCurrent);
      const ssu = new SpeechSynthesisUtterance(text);
      ssu.volume = js.amplitude;
      ssu.rate = js.speed;
      ssu.pitch = js.pitch;
      ssu.lang = "it-IT";
      // ssu.lang = "fr-FR";
      // ssu.lang = "en-GB";
      // ssu.lang = "de-DE";
      // ssu.lang = "es-ES";
      window.speechSynthesis.speak(ssu);
      this.isReading = true;
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
