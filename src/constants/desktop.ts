export const IS_DESKTOP = "IS_DESKTOP" in window || import.meta.env.VITE_DESKTOP === "true";
export const IS_BROWSER = !IS_DESKTOP;
export const DESKTOP_APP_VERSION = "DESKTOP_APP_VERSION" in window ? (window.DESKTOP_APP_VERSION as string) : null;
