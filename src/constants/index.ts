export * from "./breakpoints";

export const IS_DESKTOP = "IS_DESKTOP" in window || import.meta.env.VITE_DESKTOP === "true";
export const IS_BROWSER = !IS_DESKTOP;
