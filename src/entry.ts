import accessibilityWidget from "./accessibilityWidget";
import { getScriptDataAttribute } from "./utils/getScriptDataAttribute";

function initialize() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        document.removeEventListener('readystatechange', initialize);

        const options = {
            position: getScriptDataAttribute("position"),
            offset: getScriptDataAttribute("offset")?.split(",").map(Number),
            size: getScriptDataAttribute("size")
        };

        window.AccessibilityWidgetPlugin = accessibilityWidget({
            options
        });
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Initialize if the script is appended to the DOM when document.readyState is completed
    initialize();
}else{
    // Use readystatechange for async support
    document.addEventListener("readystatechange", initialize);
}

