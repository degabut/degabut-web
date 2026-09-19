import { AppRoutes } from "@app/routes";
import { useNavigate } from "@common";
import { YOUTUBE_OAUTH_REDIRECT_URI } from "@constants";
import type { IMediaSource } from "@media-source";
import { useSettings } from "@settings";
import {
	createContext,
	createEffect,
	createSignal,
	on,
	onMount,
	useContext,
	type Accessor,
	type ParentComponent,
} from "solid-js";
import { YouTubeConnectApi } from "../../apis";
import { YouTubeSdk } from "../../sdk";
import { AddToYouTubePlaylistModal, SyncToYouTubeModal, YouTubeCodePromptModal } from "./components";

export type SyncVideoIdsInput = string[] | (() => Promise<string[]>);

export type SyncRequest = {
	videoIds: SyncVideoIdsInput;
	defaultPlaylistName: string;
};

export type YouTubeConnectContextStore = {
	state: Accessor<YouTubeConnectionState>;
	client: YouTubeSdk;
	initialize: () => void;
	authenticate: (codeOrManual?: string | boolean) => Promise<void>;
	logout: () => void;
	addToPlaylist: (playlistId: string, videoId: string) => Promise<boolean>;
	promptAddToPlaylist: (media: IMediaSource[] | null) => void;
	setSyncRequest: (request: SyncRequest | null) => void;
};

export enum YouTubeConnectionState {
	Empty,
	Disabled,
	Disconnected,
	Authenticating,
	Connected,
}

const DEFAULT_SYNC_PLAYLIST_NAME = "Degabut Playlist";

const scopes = [
	"https://www.googleapis.com/auth/youtube.readonly",
	"https://www.googleapis.com/auth/youtube.force-ssl",
];

export const YouTubeConnectContext = createContext<YouTubeConnectContextStore>({} as YouTubeConnectContextStore);

export const YouTubeConnectProvider: ParentComponent = (props) => {
	const { settings } = useSettings();
	const navigate = useNavigate();
	const clientId = () => settings["youtube.clientId"];
	const clientSecret = () => settings["youtube.clientSecret"];

	let currentClientId = clientId();
	let currentClientSecret = clientSecret();
	let client = new YouTubeSdk(clientId(), YOUTUBE_OAUTH_REDIRECT_URI, scopes, "", clientSecret());
	const [isShowCodePrompt, setIsShowCodePrompt] = createSignal(false);
	const [mediaSources, setMediaSources] = createSignal<null | IMediaSource[]>(null);
	const [state, setState] = createSignal(YouTubeConnectionState.Empty);
	const [syncRequest, setSyncRequest] = createSignal<SyncRequest | null>(null);

	createEffect(() => {
		if (!settings["youtube.enabled"]) return logout();
	});

	createEffect(
		on([clientId, clientSecret], ([id, secret]) => {
			if (id === currentClientId && secret === currentClientSecret) return;
			currentClientId = id;
			currentClientSecret = secret;
			logout();
			instantiate();
		})
	);

	const initialize = async () => {
		if (!settings["youtube.enabled"]) return setState(YouTubeConnectionState.Disabled);
		if (!clientId()) return setState(YouTubeConnectionState.Disconnected);

		if (state() === YouTubeConnectionState.Authenticating) return;

		setState(YouTubeConnectionState.Authenticating);
		const token = await client.getAccessToken();
		setState(token ? YouTubeConnectionState.Connected : YouTubeConnectionState.Disconnected);
	};

	const instantiate = () => {
		const id = clientId();
		if (!id) return;
		client = new YouTubeSdk(id, YOUTUBE_OAUTH_REDIRECT_URI, scopes, "", clientSecret());
	};

	const authenticate = async (codeOrManual?: string | boolean) => {
		instantiate();

		if (typeof codeOrManual === "string") {
			await client.authenticate(codeOrManual);
			initialize();
		} else if (codeOrManual === true) {
			const url = await client.getRedirectUrl();
			window.open(url, "_blank")?.focus();
			setIsShowCodePrompt(true);
		} else {
			window.location.href = await client.getRedirectUrl();
		}
	};

	const onCodeAuthenticate = async (code: string) => {
		await authenticate(code);
		setIsShowCodePrompt(false);
		navigate(AppRoutes.Youtube);
	};

	const removeCodeFromUrl = () => {
		const url = new URL(window.location.href);
		url.searchParams.delete("code");
		url.searchParams.delete("scope");

		const newUrl = url.search ? url.href : url.href.replace("?", "");
		window.history.replaceState({}, document.title, newUrl);
	};

	onMount(async () => {
		if (window.opener) return;

		if (window.location.pathname === AppRoutes.OAuthYoutube) {
			const params = new URLSearchParams(window.location.search);
			const code = params.get("code");
			if (code) {
				await onCodeAuthenticate(code);
				removeCodeFromUrl();
				return;
			}
		}

		initialize();
	});

	const logout = () => {
		client.logOut();
		setState(YouTubeConnectionState.Disconnected);
	};

	const addToPlaylist = async (playlistId: string, videoId: string): Promise<boolean> => {
		const api = new YouTubeConnectApi(client);
		return await api.addToPlaylist(playlistId, videoId);
	};

	const store: YouTubeConnectContextStore = {
		client,
		state,
		initialize,
		authenticate,
		logout,
		addToPlaylist,
		promptAddToPlaylist: setMediaSources,
		setSyncRequest,
	};

	return (
		<YouTubeConnectContext.Provider value={store}>
			<YouTubeCodePromptModal
				isOpen={isShowCodePrompt()}
				onClose={() => setIsShowCodePrompt(false)}
				onAuthenticate={onCodeAuthenticate}
			/>
			<AddToYouTubePlaylistModal
				mediaSources={mediaSources()}
				isOpen={!!mediaSources()}
				onClose={() => setMediaSources(null)}
			/>
			<SyncToYouTubeModal
				isOpen={!!syncRequest()}
				videoIds={syncRequest()?.videoIds ?? []}
				defaultPlaylistName={syncRequest()?.defaultPlaylistName ?? DEFAULT_SYNC_PLAYLIST_NAME}
				onClose={() => setSyncRequest(null)}
			/>
			{props.children}
		</YouTubeConnectContext.Provider>
	);
};

export const useYouTubeConnect = () => useContext(YouTubeConnectContext);
