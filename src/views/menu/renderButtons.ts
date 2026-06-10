

export default function renderButtons(buttons, btnClass?:string) {
    let _html = '';

    for(let i = buttons.length; i--;) {
        const button = buttons[i];

        _html += `<button class="asw-btn ${ btnClass || '' }" type="button" data-key="${ button.key }" title="${ button.label }">${ button.icon }<span class="asw-translate">${ button.label }</span></button>`;
    }
    
    return _html;
}