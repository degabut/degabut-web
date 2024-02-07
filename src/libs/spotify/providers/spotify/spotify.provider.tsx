import { SPOTIFY_OAUTH_REDIRECT_URI } from "@constants";
import { AuthorizationCodeWithPKCEStrategy, SpotifyApi as SpotifySdk } from "@fostertheweb/spotify-web-sdk";
import { useSettings } from "@settings/hooks";
import { Accessor, ParentComponent, createContext, createEffect, createSignal, on } from "solid-js";
import { useSpotifyData } from "./hooks";

export type SpotifyContextStore = {
	isConnected: Accessor<boolean>;
	client: SpotifySdk;
	initialize: () => Promise<void>;
	authenticate: () => Promise<void>;
	logout: () => void;
} & ReturnType<typeof useSpotifyData>;

export const SpotifyContext = createContext<SpotifyContextStore>({
	isConnected: () => false,
	client: {} as SpotifySdk,
	initialize: async () => {},
	authenticate: async () => {},
	logout: () => {},
} as SpotifyContextStore);

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
	let currentClientId = settings["spotify.clientId"];
	let client = new SpotifySdk(
		new AuthorizationCodeWithPKCEStrategy(settings["spotify.clientId"], SPOTIFY_OAUTH_REDIRECT_URI, scopes)
	);
	const [isConnected, setIsConnected] = createSignal(false);
	const data = useSpotifyData(isConnected, client);

	createEffect(() => {
		if (!settings["spotify.enabled"]) return logout();
		updateIsConnected();
	});

	createEffect(
		on(
			() => settings["spotify.clientId"],
			(clientId) => {
				if (clientId === currentClientId) return;
				currentClientId = clientId;
				logout();
			}
		)
	);

	const updateIsConnected = async () => {
		const token = await client.getAccessToken();
		setIsConnected(!!token);
	};

	const initialize = async () => {
		const clientId = settings["spotify.clientId"];
		if (!clientId) return;

		client.logOut();
		client = new SpotifySdk(new AuthorizationCodeWithPKCEStrategy(clientId, SPOTIFY_OAUTH_REDIRECT_URI, scopes));
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
