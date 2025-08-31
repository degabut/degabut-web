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
	isConnected: Accessor<boolean>;
	client: SpotifySdk;
	initialize: () => void;
	initiateManualAuthentication: () => void;
	authenticate: (code?: string) => Promise<void>;
	logout: () => void;
	getRedirectUrl: () => Promise<string>;
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
	const navigate = useNavigate();
	const clientId = () => SPOTIFY_CLIENT_ID || settings["spotify.clientId"];

	let currentClientId = clientId();
	let client = new SpotifySdk(clientId(), SPOTIFY_OAUTH_REDIRECT_URI, scopes);
	const [isShowCodePrompt, setIsShowCodePrompt] = createSignal(false);
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

	const initialize = () => {
		const id = clientId();
		if (!id) return;

		client.logOut();
		client = new SpotifySdk(id, SPOTIFY_OAUTH_REDIRECT_URI, scopes);
	};

	const initiateManualAuthentication = async () => {
		initialize();
		const url = await getRedirectUrl();
		window.open(url, "_blank")?.focus();
		setIsShowCodePrompt(true);
	};

	const authenticate = async (code?: string) => {
		await client.authenticate(code);
		updateIsConnected();
	};

	const getRedirectUrl = async () => {
		return client.getRedirectUrl();
	};

	const logout = () => {
		client.logOut();
		setIsConnected(false);
	};

	const onCodeAuthenticate = async (code: string) => {
		await authenticate(code);
		setIsShowCodePrompt(false);
		navigate(AppRoutes.Spotify);
	};

	const store: SpotifyContextStore = {
		client,
		isConnected,
		initialize,
		authenticate,
		initiateManualAuthentication,
		logout,
		getRedirectUrl,
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
