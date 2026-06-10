import { saveUserSettings, userSettings } from "@/globals/userSettings";
import runAccessibility from "./runAccessibility";

export default function reset() {
    document?.querySelectorAll(".accessibility-widget-selected")?.forEach(el => el?.classList?.remove("accessibility-widget-selected"))

    userSettings.states = {};
    runAccessibility();

    saveUserSettings();
}