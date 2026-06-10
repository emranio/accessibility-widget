import renderMenu from "./renderMenu";
import toggleMenu from "./toggleMenu";

export let $menu;

export function openMenu() {
    if($menu) {
        toggleMenu();
    } else {
        $menu = renderMenu();
    }
}