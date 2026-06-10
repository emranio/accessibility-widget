import template from "./readingGuide.html";
import css from "./readingGuide.css";

export default function readingGuide(enable=false) {
    let guide = document.querySelector('.accessibility-widget-rg-container');

    if(enable) {
        if(!guide) {
            guide = document.createElement("div");
            guide.classList.add('accessibility-widget-rg-container');
            guide.innerHTML = `<style>${css}</style>${template}`;

            const rgTop: HTMLElement = guide.querySelector('.accessibility-widget-rg-top');
            const rgBottom: HTMLElement = guide.querySelector('.accessibility-widget-rg-bottom');
            const margin = 20;

            window.__accessibilityWidget__onScrollReadableGuide = (event) => {
                rgTop.style.height = `${event.clientY - margin}px`;
                rgBottom.style.height = `${window.innerHeight - event.clientY - (margin * 2)}px`;
            }

            document.addEventListener('mousemove', window.__accessibilityWidget__onScrollReadableGuide, { passive: false });
            
            document.body.appendChild(guide);
        }
    } else {
        guide?.remove();

        if(window.__accessibilityWidget__onScrollReadableGuide) {
            document.removeEventListener('mousemove', window.__accessibilityWidget__onScrollReadableGuide);
            delete window.__accessibilityWidget__onScrollReadableGuide;
        }
    }
}