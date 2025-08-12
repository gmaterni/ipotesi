// --- usage_tracker.mjs ---
// Versione modulare dello script di tracciamento per Supabase.
// Esporta una funzione 'initUsageTracker' da chiamare nel tuo script principale.
//
// COME USARLO:
// 1. Copia questo file nel tuo progetto.
// 2. Nel tuo script principale (es. app.js), importa e chiama la funzione:
//
//    import { initUsageTracker } from './usage_tracker.mjs';
//    initUsageTracker();
//
// -----------------------------------------------------------------------------

// --- 1. CONFIGURAZIONE ---
const SUPABASE_URL = 'https://svffobjftswdckfkkkib.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZmZvYmpmdHN3ZGNrZmtra2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTIyMzksImV4cCI6MjA3MDUyODIzOX0.qAWczdr3VPJGz7RdG-0NDimRpGoavMfKtTg2hNxUlC0';
const TABLE_NAME = 'ipotesi';
const DISABLE_WHEN_LOCAL = true;

async function trackAccess() {
    const endpoint = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}`;
    const payload = {
      timestamp: new Date().toISOString(),
      ip_address:null,
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      referrer: document.referrer,
      country:"ipotesi",
      created_at: new Date().toISOString(), 
    };
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            console.log('Usage Tracker: Accesso registrato con successo.');
        } else {
            console.error(`Usage Tracker: Errore API Supabase. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Usage Tracker: Errore di rete o di script.', error);
    }
}

/**
 * Funzione principale da esportare.
 * Controlla la configurazione e l'ambiente prima di avviare il tracciamento.
 */
export function initUsageTracker() {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (DISABLE_WHEN_LOCAL && isLocal) {
        console.log('Usage Tracker: Ambiente locale rilevato. Tracciamento disabilitato.');
        return;
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('INSERISCI')) {
        console.error('Usage Tracker: Credenziali non configurate.');
        return;
    }

    // Usiamo un piccolo ritardo per non bloccare il rendering iniziale.
    setTimeout(trackAccess, 300);
};
