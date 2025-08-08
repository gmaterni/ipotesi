/** @format */
"use strict";

export const HttpService = {
  cacheBuster: new Date().getTime(),

  async getText(url) {
    try {
      const uniqueUrl = `${url}?cacheBuster=${this.cacheBuster}`;
      const response = await fetch(uniqueUrl, {
        headers: { "Content-Type": "text/plain" }, // UTF-8 è il default
      });
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      const text = await response.text(); // Più semplice di arrayBuffer + TextDecoder
      return text;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore sconosciuto";
      console.error(`Errore getText()  ${url}:`, message);
      alert(`Errore getText()  ${url}\n${message}`);
      throw error;
    }
  },

  async getJson(url) {
    try {
      const uniqueUrl = `${url}?cacheBuster=${this.cacheBuster}`;
      const response = await fetch(uniqueUrl, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore sconosciuto";
      console.error(`Errore getJson()  ${url}:`, message);
      alert(`Errore getJson()  ${url}\n${message}`);
      throw error;
    }
  },

  fetchText(url, fn) {
    const uniqueUrl = `${url}?cacheBuster=${this.cacheBuster}`;
    fetch(uniqueUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}\nfetchText\nurl:${url}`);
        }
        return response.text();
      })
      .then((text) => fn(text))
      .catch((error) => {
        console.error(`Error fetchText ${url}`, error);
        alert(`Error fetchText ${url}\n${error}`);
      });
  },

  fetchJson(url, fn) {
    const uniqueUrl = `${url}?cacheBuster=${this.cacheBuster}`;
    fetch(uniqueUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}\nfetchJson\nurl:${url}`);
        }
        return response.json();
      })
      .then((json) => fn(json))
      .catch((error) => {
        console.error(`Error fetchJson ${url}`, error);
        alert(`Error fetchJson ${url}\n${error}`);
      });
  },

  async getPdf(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore sconosciuto";
      console.error(`Errore getPdf() ${url}:`, message);
      alert(`Errore getPdf() ${url}\n${message}`);
      throw error;
    }
  },
};

