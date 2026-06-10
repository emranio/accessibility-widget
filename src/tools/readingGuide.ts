import template from "./readingGuide.html";
import css from "./readingGuide.css";

export default function readingGuide(enable=false) {
    let guide = document.querySelector('.a11y-rg-container');

    if(enable) {
        if(!guide) {
            guide = document.createElement("div");
            guide.classList.add('a11y-rg-container');
            guide.innerHTML = `<style>${css}</style>${template}`;

            const rgTop: HTMLElement = guide.querySelector('.a11y-rg-top');
            const rgBottom: HTMLElement = guide.querySelector('.a11y-rg-bottom');
            const margin = 20;

            window.__a11y__onScrollReadableGuide = (event) => {
                rgTop.style.height = `${event.clientY - margin}px`;
                rgBottom.style.height = `${window.innerHeight - event.clientY - (margin * 2)}px`;
            }

            document.addEventListener('mousemove', window.__a11y__onScrollReadableGuide, { passive: false });
            
            document.body.appendChild(guide);
        }
    } else {
        guide?.remove();

        if(window.__a11y__onScrollReadableGuide) {
            document.removeEventListener('mousemove', window.__a11y__onScrollReadableGuide);
            delete window.__a11y__onScrollReadableGuide;
        }
    }
}