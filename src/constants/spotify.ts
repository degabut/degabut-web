export const SPOTIFY_INTEGRATION = import.meta.env.VITE_SPOTIFY_INTEGRATION === "true";
export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
export const SPOTIFY_OAUTH_REDIRECT_URI = location.origin + "/oauth/spotify";
