import { bots } from "@constants";
import { useLocation } from "@solidjs/router";
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
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
	getUserId: () => string | null;
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

	const authManager = new AuthManager(client);
	const discordAuthManager = new DiscordAuthManager();

	client.interceptors.request.use((r) => requestInterceptor(r));
	youtubeClient.interceptors.request.use((r) => requestInterceptor(r));

	const requestInterceptor = async (req: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
		if (!req.headers.Authorization) {
			const token = authManager.getAccessToken();
			if (token) {
				req.headers.Authorization = `Bearer ${token}`;
				authManager.setAccessToken(token);
			}
		}
		return req;
	};

	const validateStatus = (status: number) => {
		if (status >= 500) return false;
		if (status === 401) logout();
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

	const getUserId = (): string | null => {
		const accessToken = authManager.getAccessToken();
		if (!accessToken) return null;
		const payload = JSON.parse(atob(accessToken.split(".")[1]));
		return payload.aud;
	};

	return (
		<ApiContext.Provider
			value={{
				authManager,
				client,
				logout,
				youtubeClient,
				setClientUrl,
				getUserId,
			}}
		>
			{props.children}
		</ApiContext.Provider>
	);
};

export const useApi = () => useContext(ApiContext);
