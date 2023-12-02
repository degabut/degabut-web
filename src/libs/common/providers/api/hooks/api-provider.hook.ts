import { bots } from "@constants";
import { useLocation, useNavigate } from "@solidjs/router";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class AuthManager {
	constructor(private client: AxiosInstance) {}

	public setAccessToken(accessToken: string): void {
		localStorage.setItem("access_token", accessToken);
		this.client.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
	}

	public getAccessToken(): string {
		return localStorage.getItem("access_token") || "";
	}

	public hasAccessToken(): boolean {
		return !!this.getAccessToken();
	}

	public resetAccessToken(): void {
		localStorage.removeItem("access_token");
	}
}

export const useApiProvider = () => {
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

	client.interceptors.request.use((r) => requestInterceptor(r));
	youtubeClient.interceptors.request.use((r) => requestInterceptor(r));

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

	const validateStatus = (status: number) => {
		if (status >= 500) return false;
		if (status === 401) {
			// unauthorized redirect to login
			const redirect = location.pathname + location.search;
			if (!redirect.startsWith("/login")) {
				navigate("/login?re=" + encodeURIComponent(redirect));
			}
		}

		return true;
	};

	const setClientUrl = (apiBaseUrl: string, youtubeBaseUrl: string) => {
		client.defaults.baseURL = apiBaseUrl;
		youtubeClient.defaults.baseURL = youtubeBaseUrl;
	};

	return { client, youtubeClient, authManager, setClientUrl };
};
