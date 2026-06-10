// types/global.d.ts

declare global {
  interface Window {
    __a11y__onScrollReadableGuide?: (event: Event) => void;
  }
}

export {};
