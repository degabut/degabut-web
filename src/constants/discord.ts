import type { Mapping } from "@discord";
import { bots } from "./bot";

export const RICH_PRESENCE_CLIENT_ID = import.meta.env.VITE_RICH_PRESENCE_CLIENT_ID || bots[0].id;
export const IS_DISCORD_EMBEDDED = new URLSearchParams(window.location.search).has("frame_id");
export const DISCORD_ACTIVITY_APPLICATION_ID = import.meta.env.VITE_DISCORD_ACTIVITY_APPLICATION_ID || bots[0].id;
export const DISCORD_ACTIVITY_URL_MAPPINGS: Mapping[] = import.meta.env.VITE_DISCORD_ACTIVITY_URL_MAPPINGS
	? JSON.parse(import.meta.env.VITE_DISCORD_ACTIVITY_URL_MAPPINGS)
	: [];
