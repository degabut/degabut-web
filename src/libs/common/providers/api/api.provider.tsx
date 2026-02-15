import { bots, IS_LINK } from "@constants";
import { useLocation } from "@solidjs/router";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import { createContext, useContext, type ParentComponent } from "solid-js";
import { useNavigate } from "../../hooks";
import { AuthManager } from "./auth-manager";
import { DiscordAuthManager } from "./discord-auth-manager";

type ApiContextStore = {
	setClientUrl: (apiBaseUrl: string, youtubeBaseUrl: string) => void;
	logout: (shouldRedirect?: boolean) => void;
	authManager: AuthManager;
	client: AxiosInstance;
	youtubeClient: AxiosInstance;
	discordClient: AxiosInstance | null;
};

const ApiContext = createContext<ApiContextStore>({} as ApiContextStore);

// TODO implement retry
export const ApiProvider: ParentComponent = (props) => {
	const navigate = useNavigate();
	const location = useLocation();

	const client = axios.create({
		baseURL: bots[0].apiBaseUrl,
		validateStatus: (s) => validateStatus(s),
	});
	const youtubeClient = axios.create({
		baseURL: bots[0].youtubeApiBaseUrl,
		validateStatus: (s) => validateStatus(s),
	});
	const discordClient = IS_LINK
		? axios.create({
				baseURL: "https://discord.com/api/v10",
				validateStatus: (s) => validateDiscordStatus(s),
		  })
		: null;
	if (discordClient) {
		axiosRetry(discordClient, {
			retries: 1,
			onRetry: () => refreshDiscordToken(),
			retryCondition: (res) => {
				return res.response?.status === 401;
			},
		});
	}

	const authManager = new AuthManager(client);
	const discordAuthManager = new DiscordAuthManager();

	client.interceptors.request.use((r) => requestInterceptor(r));
	youtubeClient.interceptors.request.use((r) => requestInterceptor(r));
	discordClient?.interceptors.request.use((r) => discordRequestInterceptor(r));

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

	const discordRequestInterceptor = async (req: AxiosRequestConfig) => {
		req.headers = discordClient?.defaults.headers.common || {};
		const token = discordAuthManager.getDiscordCredentials();
		if (token) {
			req.headers.Authorization = `Bearer ${token.accessToken}`;
		}
		return req;
	};

	const validateStatus = (status: number) => {
		if (status >= 500) return false;
		if (status === 401) logout();
		return true;
	};

	const validateDiscordStatus = (status: number) => {
		if (status >= 500 || status === 401) return false;
		return true;
	};

	const refreshDiscordToken = async () => {
		try {
			const credentials = discordAuthManager.getDiscordCredentials();
			if (!credentials) throw new Error("No Discord credentials");

			const response = await client.post("/auth/discord", { refreshToken: credentials.refreshToken });

			if (response.status >= 400) throw new Error("Failed to refresh Discord token");

			discordAuthManager.setDiscordCredentials(response.data);
		} catch (error) {
			console.error("Failed to refresh Discord token", error);
		}
	};

	const logout = (shouldRedirect = true) => {
		const loginPath = "/login";
		const redirect = location.pathname + location.search;
		if (!redirect.startsWith(loginPath)) {
			const path = shouldRedirect ? `${loginPath}?re=${encodeURIComponent(redirect)}` : loginPath;
			navigate(path);
		}
	};

	const setClientUrl = (apiBaseUrl: string, youtubeBaseUrl: string) => {
		client.defaults.baseURL = apiBaseUrl;
		youtubeClient.defaults.baseURL = youtubeBaseUrl;
	};

	return (
		<ApiContext.Provider
			value={{
				authManager,
				client,
				logout,
				youtubeClient,
				setClientUrl,
				discordClient,
			}}
		>
			{props.children}
		</ApiContext.Provider>
	);
};

export const useApi = () => useContext(ApiContext);
