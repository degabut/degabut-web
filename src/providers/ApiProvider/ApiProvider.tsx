import { Auth, AuthManager, Me, Player, Playlist, Queue, User, YouTube, YouTubeMusic } from "@api";
import { useLocation, useNavigate } from "@solidjs/router";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { createContext, ParentComponent } from "solid-js";

export type ApiContextStore = {
	client: AxiosInstance;
	setClientUrl: (apiBaseUrl: string, youtubeBaseUrl?: string) => void;
	auth: Auth;
	authManager: AuthManager;
	playlist: Playlist;
	queue: Queue;
	player: Player;
	me: Me;
	user: User;
	youtube: YouTube;
	youtubeMusic: YouTubeMusic;
};

export const ApiContext = createContext<ApiContextStore>({} as ApiContextStore);

export const ApiProvider: ParentComponent = (props) => {
	const navigate = useNavigate();
	const location = useLocation();

	const validateStatus = (status: number) => {
		if (status === 401) {
			// redirect to login
			const pathname = location.pathname;
			if (!pathname.startsWith("/login")) {
				navigate("/login?re=" + encodeURIComponent(location.pathname));
			}
		}

		if (status >= 500) return false;
		return true;
	};

	const requestInterceptor = async (req: AxiosRequestConfig) => {
		req.headers = client.defaults.headers.common || {};
		if (!req.headers.Authorization) {
			const token = authManager.getAccessToken();
			if (token) {
				req.headers.Authorization = `Bearer ${token}`;
				authManager.setAccessToken(token);
			}
		}
		return req;
	};

	const client = axios.create({
		baseURL: import.meta.env.VITE_API_BASE_URL,
		validateStatus,
	});
	const youtubeClient = axios.create({
		baseURL: import.meta.env.VITE_YOUTUBE_API_BASE_URL,
		validateStatus,
	});

	client.interceptors.request.use(requestInterceptor);
	youtubeClient.interceptors.request.use(requestInterceptor);

	const auth = new Auth(client);
	const authManager = new AuthManager(client);
	const me = new Me(client);
	const user = new User(client);
	const youtube = new YouTube(youtubeClient);
	const youtubeMusic = new YouTubeMusic(youtubeClient);
	const playlist = new Playlist(client);
	const queue = new Queue(client);
	const player = new Player(client);

	const setClientUrl = (apiBaseUrl: string, youtubeBaseUrl?: string) => {
		client.defaults.baseURL = apiBaseUrl;
		youtubeClient.defaults.baseURL = youtubeBaseUrl || import.meta.env.VITE_YOUTUBE_API_BASE_URL;
	};

	return (
		<ApiContext.Provider
			value={{
				client,
				setClientUrl,
				auth,
				authManager,
				playlist,
				queue,
				player,
				me,
				user,
				youtube,
				youtubeMusic,
			}}
		>
			{props.children}
		</ApiContext.Provider>
	);
};
