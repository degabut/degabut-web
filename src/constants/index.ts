import { bots } from "./bot";

export * from "./bot";
export * from "./breakpoints";
export * from "./desktop";

export const OAUTH_URL = import.meta.env.VITE_OAUTH_URL;
export const PROD = import.meta.env.PROD;
export const APP_VERSION = import.meta.env.APP_VERSION as string;
export const YT_IMAGE_PROXY = import.meta.env.VITE_YT_IMAGE_PROXY;
export const SPOTIFY_INTEGRATION = import.meta.env.VITE_SPOTIFY_INTEGRATION === "true";
export const RICH_PRESENCE_CLIENT_ID = import.meta.env.VITE_RICH_PRESENCE_CLIENT_ID || bots[0].id;
