export * from "./bot";
export * from "./breakpoints";

export const IS_DESKTOP = "IS_DESKTOP" in window || import.meta.env.VITE_DESKTOP === "true";
export const IS_BROWSER = !IS_DESKTOP;
export const APP_VERSION = import.meta.env.APP_VERSION;
