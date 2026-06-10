import { getStorageData, saveStorageData } from "@/storage";

export const userSettings = {
  position: undefined,
  states: {}
};

export const STORAGE_KEY = "accessibility-widget-user-settings";

export function setUserStateSettings(state) {
    userSettings.states = {
        ...userSettings.states,
        ...state
    }

    saveUserSettings();
}

export function saveUserSettings() {
    saveStorageData(STORAGE_KEY, userSettings);
}

export function getSavedUserSettings() {
    return getStorageData(STORAGE_KEY);
}