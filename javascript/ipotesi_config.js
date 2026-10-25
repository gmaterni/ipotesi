/** @format */

/**
 * ipotesi_config.js - Configurazione globale di IPOTESI.
 *
 * Centralizza le impostazioni del servizio di analytics.
 */

// Nome applicazione registrato nel worker analytics.
export const APP_NAME = "ipotesi";

// URL base del worker analytics (backend RAGINDEX).
export const WORKER_URL = "https://ragindex.workerua.workers.dev";

// Se true, impedisce l'invio degli eventi in ambiente locale.
export const DISABLE_SENDER_ON_LOCAL = true;

/**
 * Verifica se l'applicazione è in esecuzione in un ambiente locale.
 *
 * @returns {boolean} True su localhost, 127.0.0.1 o file://.
 */
export const isLocalEnvironment = function () {
  const host = window.location.hostname;
  const protocol = window.location.protocol;
  return host === "localhost" || host === "127.0.0.1" || protocol === "file:";
};
