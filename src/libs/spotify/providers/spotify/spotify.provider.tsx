import { SPOTIFY_CLIENT_ID, SPOTIFY_OAUTH_REDIRECT_URI } from "@constants";
import { useSettings } from "@settings";
import { createContext, createEffect, createSignal, on, type Accessor, type ParentComponent } from "solid-js";
import { SpotifySdk } from "../../sdk";
import { useSpotifyData } from "./hooks";

export type SpotifyContextStore = {
	isConnected: Accessor<boolean>;
	client: SpotifySdk;
	initialize: () => Promise<void>;
	authenticate: () => Promise<void>;
	logout: () => void;
} & ReturnType<typeof useSpotifyData>;

export const SpotifyContext = createContext<SpotifyContextStore>({} as SpotifyContextStore);

const scopes = [
	"playlist-read-private",
	"playlist-read-collaborative",
	"user-read-currently-playing",
	"user-read-playback-state",
	"user-read-recently-played",
	"user-library-read",
	"user-top-read",
];

export const SpotifyProvider: ParentComponent = (props) => {
	const { settings } = useSettings();
	const clientId = () => SPOTIFY_CLIENT_ID || settings["spotify.clientId"];

	let currentClientId = clientId();
	let client = new SpotifySdk(clientId(), SPOTIFY_OAUTH_REDIRECT_URI, scopes);
	const [isConnected, setIsConnected] = createSignal(false);
	const data = useSpotifyData(isConnected, client);

	createEffect(() => {
		if (!settings["spotify.enabled"] && !SPOTIFY_CLIENT_ID) return logout();
		updateIsConnected();
	});

	createEffect(
		on(clientId, (clientId) => {
			if (clientId === currentClientId) return;
			currentClientId = clientId;
			logout();
		})
	);

	const updateIsConnected = async () => {
		const token = await client.getAccessToken();
		setIsConnected(!!token);
	};

	const initialize = async () => {
		const id = clientId();
		if (!id) return;

		client.logOut();
		client = new SpotifySdk(id, SPOTIFY_OAUTH_REDIRECT_URI, scopes);
		await authenticate();
	};

	const authenticate = async () => {
		await client.authenticate();
		updateIsConnected();
	};

	const logout = () => {
		client.logOut();
		setIsConnected(false);
	};

	const store: SpotifyContextStore = {
		client,
		isConnected,
		initialize,
		authenticate,
		logout,
		...data,
	};

	return <SpotifyContext.Provider value={store}>{props.children}</SpotifyContext.Provider>;
};
