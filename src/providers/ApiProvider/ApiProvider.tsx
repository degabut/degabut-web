import { Auth, AuthManager, Player, Playlist, Queue, User, YouTube } from "@api";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useNavigate } from "solid-app-router";
import { createContext, ParentComponent } from "solid-js";

export type ApiContextStore = {
	client: AxiosInstance;
	auth: Auth;
	authManager: AuthManager;
	playlist: Playlist;
	queue: Queue;
	player: Player;
	user: User;
	youtube: YouTube;
};

export const ApiContext = createContext<ApiContextStore>({} as ApiContextStore);

export const ApiProvider: ParentComponent = (props) => {
	const navigate = useNavigate();

	const validateStatus = (status: number) => {
		if (status === 401) {
			// redirect to login
			navigate("/login");
			return false;
		}
		return true;
	};

	const requestInterceptor = async (req: AxiosRequestConfig) => {
		req.headers = client.defaults.headers.common || {};
		if (!req.headers.Authorization) {
			const token = await authManager.getAccessToken();
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
	const user = new User(client);
	const youtube = new YouTube(youtubeClient);
	const playlist = new Playlist(client);
	const queue = new Queue(client);
	const player = new Player(client);

	return (
		<ApiContext.Provider
			value={{
				client,
				auth,
				authManager,
				playlist,
				queue,
				player,
				user,
				youtube,
			}}
		>
			{props.children}
		</ApiContext.Provider>
	);
};
