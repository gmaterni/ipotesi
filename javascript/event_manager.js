/** @format */
"use strict";

// eventHandlers: Map<eventType, Map<selector, handler[]>>
const eventHandlers = new Map();

const handleEvent = (event) => {
    const selectorHandlersMap = eventHandlers.get(event.type);
    if (!selectorHandlersMap) return;

    // Iterate up the DOM tree from the event target
    for (let target = event.target; target && target !== document; target = target.parentElement) {
        // Some nodes might not have `matches` (e.g., text nodes on some browsers)
        if (!target.matches) continue;

        for (const [selector, handlers] of selectorHandlersMap.entries()) {
            if (target.matches(selector)) {
                // We call handlers on a copy of the array so if a handler unregisters itself (`once`), it doesn't mess up the loop.
                [...handlers].forEach(handler => handler(event, target));
            }
        }
    }
};

export const EventManager = {
    on(eventType, selector, handler) {
        if (!eventHandlers.has(eventType)) {
            const newSelectorMap = new Map();
            eventHandlers.set(eventType, newSelectorMap);
            document.addEventListener(eventType, handleEvent, false); // Use bubbling
        }

        const selectorMap = eventHandlers.get(eventType);
        if (!selectorMap.has(selector)) {
            selectorMap.set(selector, []);
        }

        selectorMap.get(selector).push(handler);
    },

    off(eventType, selector, handlerToRemove) {
        const selectorMap = eventHandlers.get(eventType);
        if (!selectorMap || !selectorMap.has(selector)) return;

        if (!handlerToRemove) {
            // If no specific handler is provided, remove all for that selector
            selectorMap.delete(selector);
        } else {
            const handlers = selectorMap.get(selector);
            const updatedHandlers = handlers.filter(h => h !== handlerToRemove);

            if (updatedHandlers.length > 0) {
                selectorMap.set(selector, updatedHandlers);
            } else {
                // If no handlers are left, remove the selector entry
                selectorMap.delete(selector);
            }
        }

        // If no selectors are left for this event type, remove the main listener
        if (selectorMap.size === 0) {
            eventHandlers.delete(eventType);
            document.removeEventListener(eventType, handleEvent, false);
        }
    },

    once(eventType, selector, handler) {
        const onceHandler = (event, target) => {
            handler(event, target);
            EventManager.off(eventType, selector, onceHandler);
        };
        EventManager.on(eventType, selector, onceHandler);
    }
};