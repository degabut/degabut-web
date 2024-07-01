import { AppRoutes } from "@app/routes";
import { useAuth } from "@auth";
import { Spinner, useApi } from "@common";
import { OAUTH_URL } from "@constants";
import { useDesktop } from "@desktop";
import { LoginRoutes } from "@login/routes";
import { useLocation, useNavigate } from "@solidjs/router";
import { onMount, type Component } from "solid-js";

export const OAuth: Component = () => {
	const api = useApi();
	const desktop = useDesktop();
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	onMount(async () => {
		const searchParams = new URLSearchParams(location.search);
		const code = searchParams.get("code");
		const redirectUri = new URL(OAUTH_URL).searchParams.get("redirect_uri") || undefined;
		if (!code) return navigate(LoginRoutes.Login);

		try {
			const { token } = await auth.getAccessToken(code, redirectUri);
			api.authManager.setAccessToken(token);
			desktop?.ipc.emit?.("authenticated");

			const stateString = searchParams.get("state");
			if (stateString) {
				const state = JSON.parse(decodeURIComponent(stateString));
				if (state?.redirect) return navigate(state.redirect);
			}
			navigate(AppRoutes.Queue);
		} catch (err) {
			navigate(LoginRoutes.Login);
		}
	});

	return (
		<div class="flex items-center justify-center h-full">
			<Spinner size="3xl" />
		</div>
	);
};
