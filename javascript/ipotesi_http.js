/** @format */
"use strict";

async function getText(url) {
  try {
    const response = await fetch(url, {
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
}

async function getJson(url) {
  try {
    const response = await fetch(url, {
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
}

function fetchText(url, fn) {
  fetch(url)
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
}

function fetchJson(url, fn) {
  fetch(url)
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
}
