export const YOUTUBE_INTEGRATION = import.meta.env.VITE_YOUTUBE_INTEGRATION
	? import.meta.env.VITE_YOUTUBE_INTEGRATION === "true"
	: true;
export const YOUTUBE_OAUTH_REDIRECT_URI = location.origin + "/oauth/youtube";
