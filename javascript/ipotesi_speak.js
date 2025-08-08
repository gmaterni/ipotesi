/** @format */

import { UaWindowAdm } from "./uawindow.js";

("use strict");

class TextToSpeech {
  constructor() {
    this.isReading = false;
    this.panel = false;
    this.textCurrent = "";
  }

  openSpeak() {
    this.panel = true;
    const js = this.loadSettings();
    const fhPanel = (js) => {
      return `
      <div id="configPanel" class="panel-speak">
        <div class="toolbar">
          <button id="btn-save-speak">Salva</button>
          <button id="btn-close-speak">X</button>
        </div>
        <div id="id_voices">
          <div class="voice-row">
            <label for="amplitude">Volume</label>
            <div>
              <input type="range" min="0" max="1" step="0.1" value="${js.amplitude}" name="amplitude" id="amplitude" />
              <span>${js.amplitude}</span>
            </div>
          </div>
          <div class="voice-row">
            <label for="pitch">Tono</label>
            <div>
              <input type="range" min="0" max="2" step="0.1" value="${js.pitch}" name="pitch" id="pitch" />
              <span>${js.pitch}</span>
            </div>
          </div>
          <div class="voice-row">
            <label for="speed">Velocità</label>
            <div>
              <input type="range" min="0.1" max="2" step="0.1" value="${js.speed}" name="speed" id="speed" />
              <span>${js.speed}</span>
            </div>
          </div>
        </div>
      </div>
      `;
    };

    const html = fhPanel(js);
    const w = UaWindowAdm.create("id_speak");
    w.setZ(1000);
    w.setHtml(html);
    w.vw_vh().setXY(30, 50, -1);
    w.show();
    w.drag();
    this.setSpeak();

    const wnd = w.getElement();
    wnd.querySelector("#btn-save-speak").addEventListener("click", () => this.saveSpeak());
    wnd.querySelector("#btn-close-speak").addEventListener("click", () => this.closeSpeak());

    const range = wnd.querySelectorAll('input[type="range"]');
    range.forEach((el) => {
      el.addEventListener("input", function () {
        const v = this.value;
        const p = this.parentElement.querySelector("span");
        p.innerText = v;
      });
    });
  }

  setSpeak() {
    const js = this.loadSettings();
    const w = document.getElementById("id_voices");
    if (!w) return;
    w.querySelector('[name="amplitude"]').value = js.amplitude;
    w.querySelector('[name="pitch"]').value = js.pitch;
    w.querySelector('[name="speed"]').value = js.speed;
    w.querySelector('[name="amplitude"]').parentElement.querySelector("span").innerText = js.amplitude;
    w.querySelector('[name="pitch"]').parentElement.querySelector("span").innerText = js.pitch;
    w.querySelector('[name="speed"]').parentElement.querySelector("span").innerText = js.speed;
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

  saveSpeak() {
    const w = document.getElementById("id_voices");
    if (!w) return;
    const amplitude = w.querySelector('[name="amplitude"]').value;
    const pitch = w.querySelector('[name="pitch"]').value;
    const speed = w.querySelector('[name="speed"]').value;
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
      const readButton = document.getElementById("btn-toggle-reading");
      if (readButton) readButton.innerText = "▶";
      window.speechSynthesis.cancel();
      this.isReading = false;
    }
  }

  toggleReading(text) {
    this.textCurrent = text;
    if (this.isReading) {
      this.stopReading();
    } else {
      const readButton = document.getElementById("btn-toggle-reading");
      if (readButton) readButton.innerText = "⏸";
      this.isReading = true;

      const js = this.loadSettings();
      const cleanedText = this.cleanupText(this.textCurrent);
      const ssu = new SpeechSynthesisUtterance(cleanedText);

      ssu.volume = js.amplitude;
      ssu.rate = js.speed;
      ssu.pitch = js.pitch;
      ssu.lang = "it-IT";

      const resetState = () => {
        this.isReading = false;
        if (readButton) readButton.innerText = "▶";
      };

      ssu.onend = resetState;
      ssu.onerror = (event) => {
        console.error("Errore nella sintesi vocale:", event.error);
        resetState();
      };

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

export const tts = new TextToSpeech();
