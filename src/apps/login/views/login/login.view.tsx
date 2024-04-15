import { A, Spinner, useApi } from "@common";
import { IS_DISCORD_EMBEDDED, OAUTH_URL } from "@constants";
import { useDesktop } from "@desktop";
import { useLocation } from "@solidjs/router";
import { Show, onMount, type Component } from "solid-js";

export const Login: Component = () => {
	const api = useApi();
	const desktop = useDesktop();
	const location = useLocation();

	const oauthUrl = () => {
		let url = OAUTH_URL;
		const redirect = new URLSearchParams(location.search).get("re");
		if (redirect) url += "&state=" + encodeURIComponent(JSON.stringify({ redirect }));
		return url;
	};

	onMount(() => {
		if (api.authManager.hasAccessToken()) {
			api.authManager.resetAccessToken();
			localStorage.clear();
			desktop?.ipc.onLoggedOut?.();
		}
	});

	return (
		<div class="flex items-center justify-center h-full">
			<Show when={!IS_DISCORD_EMBEDDED} fallback={<Spinner size="3xl" />}>
				<div class="flex-col-center sm:bg-neutral-900 bg-transparent sm:px-16 sm:py-24 rounded-2xl">
					<img src="/android-chrome-512x512.png" class="w-32 h-32" />
					<div class="text-4xl font-brand mt-6 font-semibold">degabut</div>
					<div class="mt-24">
						<A
							href={oauthUrl()}
							class="border border-neutral-100 px-8 py-2 rounded-full text-lg text-center hover:bg-white/10 transition-colors"
						>
							Login with Discord
						</A>
					</div>
				</div>
			</Show>
		</div>
	);
};
