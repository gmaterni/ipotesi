/** @format */

/**
 * ipotesi_sender.js - Servizio di invio eventi e analytics.
 *
 * Gestisce l'invio asincrono di dati verso il worker RAGINDEX per il
 * tracciamento degli accessi, includendo i metadata dell'ambiente.
 * L'invio viene saltato automaticamente in ambiente locale.
 */

import { APP_NAME, WORKER_URL, DISABLE_SENDER_ON_LOCAL, isLocalEnvironment } from "./ipotesi_config.js";

// Chiave localStorage per l'identificativo persistente del visitatore.
const USER_ID_KEY = "ipotesi_user_id";

/**
 * Configurazione globale del mittente.
 * @private
 */
const _config = {
  workerUrl: WORKER_URL,
  userId: null,
  isInitialized: false
};

// ============================================================================
// FUNZIONI PRIVATE
// ============================================================================

/**
 * Restituisce l'identificativo utente: quello passato a init(), altrimenti
 * un UUID persistito in localStorage, altrimenti un fallback temporaneo.
 *
 * @returns {string} Identificativo del visitatore.
 * @private
 */
const _getUserId = function () {
  if (_config.userId) {
    return _config.userId;
  }

  let userId = null;
  try {
    userId = localStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.warn("UaSender: localStorage non disponibile", error);
  }

  if (!userId) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      userId = window.crypto.randomUUID();
    } else {
      userId = `${APP_NAME}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }

    try {
      localStorage.setItem(USER_ID_KEY, userId);
    } catch (error) {
      console.warn("UaSender: impossibile salvare l'userId", error);
    }
  }

  return userId;
};

/**
 * Raccoglie i metadata dell'ambiente corrente.
 *
 * @returns {Object} Oggetto contenente metadata di sistema.
 * @private
 */
const _getMetadata = function () {
  const metadata = {
    userAgent: navigator.userAgent,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    referrer: document.referrer,
    urlParams: Object.fromEntries(new URLSearchParams(window.location.search)),
    timestamp: Math.floor(Date.now() / 1000)
  };

  return metadata;
};

// ============================================================================
// API PUBBLICA
// ============================================================================

export const UaSender = {

  /**
   * Inizializza il servizio di invio eventi.
   *
   * @param {Object} options - Opzioni di configurazione.
   * @param {string} [options.workerUrl] - URL base del worker analytics.
   * @param {string} [options.userId] - Identificativo unico dell'utente.
   * @returns {void}
   */
  init: function (options = {}) {
    if (options.workerUrl) {
      _config.workerUrl = options.workerUrl.replace(/\/+$/, "");
    }

    if (options.userId) {
      _config.userId = options.userId;
    }

    _config.isInitialized = true;
    console.info(`UaSender.init: servizio pronto. URL: ${_config.workerUrl}`);
  },

  /**
   * Invia un evento asincrono al server di analytics.
   *
   * Non solleva mai eccezioni: in caso di errore restituisce null e
   * registra un avviso in console, senza interrompere l'applicazione.
   *
   * @param {string} appName - Nome dell'applicazione.
   * @param {string} actionName - Nome dell'azione eseguita.
   * @returns {Promise<Object|null>} Risposta del server o null.
   */
  sendEventAsync: async function (appName, actionName) {
    // 1. Validazione input (fail fast)
    if (!appName || !actionName) {
      console.error("UaSender.sendEventAsync: parametri mancanti");
      return null;
    }

    // 2. Controllo ambiente locale
    if (DISABLE_SENDER_ON_LOCAL && isLocalEnvironment()) {
      console.info("UaSender.sendEventAsync: invio saltato (ambiente locale)");
      return null;
    }

    // 3. Preparazione payload
    const payload = {
      appName: appName,
      actionName: actionName,
      userId: _getUserId(),
      ..._getMetadata()
    };

    // 4. Invio richiesta
    try {
      const endpoint = `${_config.workerUrl}/api/analytics`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true
      });

      if (!response.ok) {
        console.warn(`UaSender.sendEventAsync: invio evento fallito [${response.status}]`);
        return null;
      }

      return await response.json();

    } catch (error) {
      console.warn("UaSender.sendEventAsync: errore di rete", error);
      return null;
    }
  }
};
