// types/global.d.ts

declare global {
  interface Window {
    __asw__onScrollReadableGuide?: (event: Event) => void;
  }
}

export {};
