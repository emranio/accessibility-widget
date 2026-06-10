import { saveUserSettings, userSettings } from "@/globals/userSettings";
import runAccessibility from "./runAccessibility";

export default function reset() {
    document?.querySelectorAll(".a11y-selected")?.forEach(el => el?.classList?.remove("a11y-selected"))

    userSettings.states = {};
    runAccessibility();

    saveUserSettings();
}