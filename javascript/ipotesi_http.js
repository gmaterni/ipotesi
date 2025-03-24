/** @format */
"use strict";

// Memorizza il cacheBuster in una variabile all'inizio del script
const cacheBuster = new Date().getTime();

// NON USATO
async function getText(url) {
  try {
    const uniqueUrl = `${url}?cacheBuster=${cacheBuster}`;
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
}

async function getJson(url) {
  try {
    const uniqueUrl = `${url}?cacheBuster=${cacheBuster}`;
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
}

function fetchText(url, fn) {
  const uniqueUrl = `${url}?cacheBuster=${cacheBuster}`;
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
}

// NN USATO
function fetchJson(url, fn) {
  const uniqueUrl = `${url}?cacheBuster=${cacheBuster}`;
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
}

async function getPdf(url) {
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
}
