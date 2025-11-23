import { AppRoutes } from "@app/routes";
import { useNavigate } from "@common";
import { SPOTIFY_CLIENT_ID, SPOTIFY_OAUTH_REDIRECT_URI } from "@constants";
import { useSettings } from "@settings";
import {
	createContext,
	createEffect,
	createSignal,
	on,
	useContext,
	type Accessor,
	type ParentComponent,
} from "solid-js";
import { SpotifySdk } from "../../sdk";
import { SpotifyCodePromptModal } from "./components";
import { useSpotifyData } from "./hooks";

export type SpotifyContextStore = {
	state: Accessor<SpotifyConnectionState>;
	client: SpotifySdk;
	initialize: () => void;
	authenticate: (codeOrManual?: string | boolean) => Promise<void>;
	logout: () => void;
} & ReturnType<typeof useSpotifyData>;

export const SpotifyContext = createContext<SpotifyContextStore>({} as SpotifyContextStore);

export enum SpotifyConnectionState {
	Empty,
	Disconnected,
	Authenticating,
	Connected,
}

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
	const navigate = useNavigate();
	const clientId = () => SPOTIFY_CLIENT_ID || settings["spotify.clientId"];

	let currentClientId = clientId();
	let client = new SpotifySdk(clientId(), SPOTIFY_OAUTH_REDIRECT_URI, scopes);
	const [isShowCodePrompt, setIsShowCodePrompt] = createSignal(false);
	const [state, setState] = createSignal(SpotifyConnectionState.Empty);
	const data = useSpotifyData(() => state() === SpotifyConnectionState.Connected, client);

	createEffect(() => {
		if (!settings["spotify.enabled"] && !SPOTIFY_CLIENT_ID) return logout();
	});

	createEffect(
		on(clientId, (clientId) => {
			if (clientId === currentClientId) return;
			currentClientId = clientId;
			logout();
		})
	);

	const initialize = async () => {
		setState(SpotifyConnectionState.Authenticating);
		const token = await client.getAccessToken();
		setState(token ? SpotifyConnectionState.Connected : SpotifyConnectionState.Disconnected);
	};

	const instantiate = () => {
		logout();
		const id = clientId();
		if (!id) return;

		client = new SpotifySdk(id, SPOTIFY_OAUTH_REDIRECT_URI, scopes);
	};

	const authenticate = async (codeOrManual?: string | boolean) => {
		instantiate();

		if (codeOrManual === true) {
			const url = await client.getRedirectUrl();
			window.open(url, "_blank")?.focus();
			setIsShowCodePrompt(true);
		} else {
			await client.authenticate(codeOrManual || undefined);
			initialize();
		}
	};

	const onCodeAuthenticate = async (code: string) => {
		await authenticate(code);
		setIsShowCodePrompt(false);
		navigate(AppRoutes.Spotify);
	};

	const logout = () => {
		client.logOut();
		setState(SpotifyConnectionState.Disconnected);
	};

	const store: SpotifyContextStore = {
		client,
		state,
		initialize,
		authenticate,
		logout,
		...data,
	};

	return (
		<>
			<SpotifyCodePromptModal
				isOpen={isShowCodePrompt()}
				onClose={() => setIsShowCodePrompt(false)}
				onAuthenticate={onCodeAuthenticate}
			/>
			<SpotifyContext.Provider value={store}>{props.children}</SpotifyContext.Provider>
		</>
	);
};

export const useSpotify = () => useContext(SpotifyContext);
