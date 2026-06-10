// types/global.d.ts

declare global {
  interface Window {
    __accessibilityWidget__onScrollReadableGuide?: (event: Event) => void;
  }
}

export {};
