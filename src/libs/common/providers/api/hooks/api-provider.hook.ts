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

	public resetAccessToken(): void {
		localStorage.removeItem("access_token");
	}
}

export const useApiProvider = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const client = axios.create({
		baseURL: import.meta.env.VITE_API_BASE_URL,
		validateStatus: (s) => validateStatus(s),
	});
	const youtubeClient = axios.create({
		baseURL: import.meta.env.VITE_YOUTUBE_API_BASE_URL,
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
			const pathname = location.pathname;
			if (!pathname.startsWith("/login")) {
				navigate("/login?re=" + encodeURIComponent(location.pathname));
			}
		}

		return true;
	};

	const setClientUrl = (apiBaseUrl: string, youtubeBaseUrl?: string) => {
		client.defaults.baseURL = apiBaseUrl;
		youtubeClient.defaults.baseURL = youtubeBaseUrl || import.meta.env.VITE_YOUTUBE_API_BASE_URL;
	};

	return { client, youtubeClient, authManager, setClientUrl };
};
