import { useApi } from "@hooks/useApi";
import { useLocation, useNavigate } from "@solidjs/router";
import { Component, onMount } from "solid-js";

export const OAuth: Component = () => {
	const api = useApi();
	const navigate = useNavigate();
	const location = useLocation();

	onMount(async () => {
		const code = new URLSearchParams(location.query).get("code");
		const redirectUri = new URL(import.meta.env.VITE_OAUTH_URL).searchParams.get("redirect_uri");
		if (!code || !redirectUri) return navigate("/login");

		try {
			const accessToken = await api.auth.getAccessToken(code, redirectUri);
			api.authManager.setAccessToken(accessToken);
			const redirect = localStorage.getItem("redirect");

			if (redirect) {
				localStorage.removeItem("redirect");
				navigate(redirect);
			} else {
				navigate("/app/queue");
			}
		} catch (err) {
			navigate("/login");
		}
	});

	return <></>;
};
