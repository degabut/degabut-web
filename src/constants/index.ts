export * from "./bot";
export * from "./desktop";
export * from "./discord";
export * from "./spotify";

export const IS_LINK = !!localStorage.getItem("discord_credentials");
export const PROD = import.meta.env.PROD;
export const APP_VERSION = import.meta.env.APP_VERSION as string;
export const OAUTH_URL = import.meta.env.VITE_OAUTH_URL;
export const YT_IMAGE_PROXY = import.meta.env.VITE_YT_IMAGE_PROXY;
