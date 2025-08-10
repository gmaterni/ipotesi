# Gestione della Memoria - Funzioni Critiche da Correggere

## 1. **Reader Class - Problema Grave con ESC Handler**

### Funzione Problematica: `enableEsc()` e `disableEsc()`
```javascript
// PROBLEMA: enableEsc() aggiunge, disableEsc() aggiunge di nuovo!
enableEsc() {
   document.addEventListener("keydown", this.escKeyHandler); // ✗ AGGIUNGE
}

disableEsc() {
   document.addEventListener("keydown", this.escKeyHandler); // ✗ AGGIUNGE ANCORA!
}
```

**Problema**: `disableEsc()` dovrebbe **rimuovere** il listener, non aggiungerlo di nuovo!

### Correzione Immediata:
```javascript
enableEsc() {
   document.addEventListener("keydown", this.escKeyHandler);
}

disableEsc() {
   document.removeEventListener("keydown", this.escKeyHandler); // ✓ RIMUOVE
}
```

---

## 2. **UaDrag - Event Listeners Non Puliti**

### Funzione Problematica: `closeDragElement()`
```javascript
const closeDragElement = function () {
    document.onmouseup = null;      // ✓ OK
    document.onmousemove = null;    // ✓ OK
    // ✗ MANCA: Non rimuove onmousedown dall'elemento!
};
```

### Correzione Completa:
```javascript
export var UaDrag = function (element) {
    let dragState = {
        pos1: 0, pos2: 0, pos3: 0, pos4: 0,
        mouseDownHandler: null,
        mouseMoveHandler: null,
        mouseUpHandler: null
    };

    const cleanup = () => {
        // Rimuovi tutti i listeners
        if (dragState.mouseDownHandler) {
            element.removeEventListener('mousedown', dragState.mouseDownHandler);
        }
        if (dragState.mouseMoveHandler) {
            document.removeEventListener('mousemove', dragState.mouseMoveHandler);
        }
        if (dragState.mouseUpHandler) {
            document.removeEventListener('mouseup', dragState.mouseUpHandler);
        }
    };

    // Restituisci funzione di cleanup per permettere pulizia esterna
    return { cleanup };
};
```

---

## 3. **TextToSpeech - Listeners Range Non Puliti**

### Funzione Problematica: `openSpeak()`
```javascript
openSpeak() {
    // ... codice ...
    const range = wnd.querySelectorAll('input[type="range"]');
    range.forEach((el) => {
      el.addEventListener("input", function () { // ✗ LISTENER MAI RIMOSSO
        const v = this.value;
        const p = this.parentElement.querySelector("span");
        p.innerText = v;
      });
    });
}
```

### Correzione con Cleanup:
```javascript
class TextToSpeech {
    constructor() {
        this.activeListeners = new Map(); // Traccia listeners attivi
    }

    openSpeak() {
        // ... setup HTML ...
        
        const cleanup = () => this.cleanupListeners('speak-panel');
        
        // Rimuovi listeners precedenti
        cleanup();
        
        // Aggiungi nuovi listeners con tracciamento
        this.addTrackedListener('speak-panel', 'btn-save-speak', 'click', () => this.saveSpeak());
        this.addTrackedListener('speak-panel', 'btn-close-speak', 'click', () => this.closeSpeak());
        
        // Range inputs
        const ranges = wnd.querySelectorAll('input[type="range"]');
        ranges.forEach((el, index) => {
            const handler = function() {
                const v = this.value;
                const p = this.parentElement.querySelector("span");
                p.innerText = v;
            };
            this.addTrackedListener('speak-panel', `range-${index}`, 'input', handler, el);
        });
    }

    addTrackedListener(group, id, event, handler, element = null) {
        const target = element || document.getElementById(id);
        if (!target) return;

        if (!this.activeListeners.has(group)) {
            this.activeListeners.set(group, new Map());
        }
        
        // Rimuovi listener precedente se esiste
        const groupListeners = this.activeListeners.get(group);
        const existing = groupListeners.get(id);
        if (existing) {
            existing.element.removeEventListener(existing.event, existing.handler);
        }
        
        // Aggiungi nuovo listener
        target.addEventListener(event, handler);
        groupListeners.set(id, { element: target, event, handler });
    }

    cleanupListeners(group) {
        const groupListeners = this.activeListeners.get(group);
        if (!groupListeners) return;

        groupListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        groupListeners.clear();
    }

    closeSpeak() {
        this.cleanupListeners('speak-panel'); // ✓ PULIZIA
        UaWindowAdm.close("id_speak");
        this.panel = false;
    }
}
```

---

## 4. **Menu System - Listener Duplicati**

### Funzione Problematica: `initMenu()`
```javascript
const initMenu = () => {
  // ✗ PROBLEMA: Ogni chiamata aggiunge nuovi listeners senza rimuovere i precedenti
  const btnDarkTheme = document.getElementById("btn-dark-theme");
  if (btnDarkTheme) btnDarkTheme.addEventListener("click", setDark);
  
  const btnLightTheme = document.getElementById("btn-light-theme");
  if (btnLightTheme) btnLightTheme.addEventListener("click", setLight);
  // ... altri listeners ...
};
```

### Correzione con Manager Centralizzato:
```javascript
class EventManager {
    constructor() {
        this.listeners = new Map();
    }

    addListener(id, event, handler) {
        const key = `${id}-${event}`;
        
        // Rimuovi listener precedente se esiste
        this.removeListener(id, event);
        
        const element = document.getElementById(id);
        if (!element) return false;
        
        element.addEventListener(event, handler);
        this.listeners.set(key, { element, event, handler });
        return true;
    }

    removeListener(id, event) {
        const key = `${id}-${event}`;
        const listener = this.listeners.get(key);
        
        if (listener) {
            listener.element.removeEventListener(listener.event, listener.handler);
            this.listeners.delete(key);
        }
    }

    removeAllListeners() {
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.listeners.clear();
    }
}

// Uso globale
const eventManager = new EventManager();

const initMenu = () => {
    // Ora è sicuro chiamare più volte
    eventManager.addListener("btn-dark-theme", "click", setDark);
    eventManager.addListener("btn-light-theme", "click", setLight);
    eventManager.addListener("btn-help", "click", opHelp);
    // ... altri listeners ...
};
```

---

## 5. **Content Loading - Listener Sovrapposti**

### Funzione Problematica: `showSommario()` e `showIndici()`
```javascript
export const showSommario = function () {
  const item1 = document.getElementById("id_item1");
  if (item1) {
    item1.removeEventListener("click", handleContentClick); // ✓ Rimuove
    item1.addEventListener("click", handleContentClick);     // ✓ Aggiunge
    loadContent("./data/indice.html", item1);
  }
};

export const showIndici = function () {
  const item1 = document.getElementById("id_item1");
  if (item1) {
    item1.removeEventListener("click", handleContentClick); // ✗ STESSO ELEMENTO!
    item1.addEventListener("click", handleContentClick);     // ✗ LISTENER DUPLICATO!
    loadContent("./data/archivio.html", item1);
  }
};
```

**Problema**: Entrambe le funzioni aggiungono lo stesso listener allo stesso elemento.

### Correzione:
```javascript
class ContentManager {
    constructor() {
        this.activeElement = null;
        this.currentHandler = null;
    }

    setupContentArea(elementId, handler) {
        const element = document.getElementById(elementId);
        if (!element) return false;

        // Cleanup precedente
        if (this.activeElement && this.currentHandler) {
            this.activeElement.removeEventListener("click", this.currentHandler);
        }

        // Setup nuovo
        element.addEventListener("click", handler);
        this.activeElement = element;
        this.currentHandler = handler;
        
        return true;
    }

    cleanup() {
        if (this.activeElement && this.currentHandler) {
            this.activeElement.removeEventListener("click", this.currentHandler);
            this.activeElement = null;
            this.currentHandler = null;
        }
    }
}

const contentManager = new ContentManager();

export const showSommario = function () {
    contentManager.setupContentArea("id_item1", handleContentClick);
    loadContent("./data/indice.html", document.getElementById("id_item1"));
};

export const showIndici = function () {
    contentManager.setupContentArea("id_item1", handleContentClick);
    loadContent("./data/archivio.html", document.getElementById("id_item1"));
};
```

---

## 6. **UaWindowAdm - Cleanup Incompleto**

### Funzione Problematica: `remove()`
```javascript
remove(id) {
    if (!this.ws[id]) return;
    document.getElementById(id).remove();  // ✓ Rimuove DOM
    this.ws[id] = null;                   // ✗ Non sufficiente!
    delete this.ws[id];                   // ✓ OK
    // ✗ MANCA: Non pulisce listeners interni della finestra!
}
```

### Correzione con Cleanup Completo:
```javascript
remove(id) {
    const window = this.ws[id];
    if (!window) return;
    
    // Cleanup listeners della finestra prima di rimuoverla
    if (window.cleanup && typeof window.cleanup === 'function') {
        window.cleanup();
    }
    
    // Rimuovi drag listeners se presenti
    const element = document.getElementById(id);
    if (element && element._dragCleanup) {
        element._dragCleanup();
    }
    
    // Rimuovi dal DOM
    element?.remove();
    
    // Cleanup riferimenti
    delete this.ws[id];
}
```
