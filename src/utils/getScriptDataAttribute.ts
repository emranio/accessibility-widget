export function getScriptDataAttribute(attr) {
    const key = `data-a11y-${attr}`;

    const script = document.currentScript;
    if (script?.hasAttribute(key)) {
        return script.getAttribute(key);
    }
    
    return document.querySelector(`[${key}]`)?.getAttribute(key);
}