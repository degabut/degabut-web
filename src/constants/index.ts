export * from "./breakpoints";

export const IS_BROWSER = !("IS_DESKTOP" in window);
export const IS_DESKTOP = !IS_BROWSER;
