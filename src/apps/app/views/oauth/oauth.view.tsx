import { useAuth } from "@auth/hooks";
import { useApi } from "@common/hooks";
import { OAUTH_URL } from "@constants";
import { useDesktop } from "@desktop/hooks";
import { useLocation, useNavigate } from "@solidjs/router";
import { Component, onMount } from "solid-js";

export const OAuth: Component = () => {
	const api = useApi();
	const desktop = useDesktop();
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	onMount(async () => {
		const code = new URLSearchParams(location.query).get("code");
		const redirectUri = new URL(OAUTH_URL).searchParams.get("redirect_uri");
		if (!code || !redirectUri) return navigate("/login");

		try {
			const accessToken = await auth.getAccessToken(code, redirectUri);
			api.authManager.setAccessToken(accessToken);
			desktop?.ipc.onAuthenticated();
			navigate("/queue");
		} catch (err) {
			navigate("/login");
		}
	});

	return <></>;
};
