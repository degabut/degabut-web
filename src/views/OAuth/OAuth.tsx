import { Text } from "@components/Text";
import { useApi } from "@hooks/useApi";
import axios from "axios";
import { useLocation, useNavigate } from "solid-app-router";
import { Component, createSignal, onMount } from "solid-js";

export const OAuth: Component = () => {
	const api = useApi();
	const [isAuthenticating, setIsAuthenticating] = createSignal(true);
	const navigate = useNavigate();
	const location = useLocation();

	onMount(async () => {
		const code = new URLSearchParams(location.query).get("code");
		let redirectUri = new URL(import.meta.env.VITE_OAUTH_URL).searchParams.get("redirect_uri");
		if (!code || !redirectUri) return navigate("/login");

		const isTargetDesktop = location.query["target"] === "desktop";
		if (isTargetDesktop) redirectUri += "?target=desktop";

		try {
			const accessToken = await api.auth.getAccessToken(code, redirectUri);
			if (isTargetDesktop) {
				await axios.post("http://localhost:39821/oauth", accessToken);
				setIsAuthenticating(false);
			} else {
				api.authManager.setAccessToken(accessToken);
				navigate("/");
			}
		} catch (err) {
			navigate("/login");
		}
	});

	return (
		<div class="flex-row-center justify-center h-full">
			<Text.H2>{isAuthenticating() ? "Loading..." : "You can close this tab now :)"}</Text.H2>
		</div>
	);
};
