import { A, Spinner } from "@common/components";
import { useApi } from "@common/hooks";
import { IS_DISCORD_EMBEDDED, OAUTH_URL } from "@constants";
import { useDesktop } from "@desktop/hooks";
import { useDiscord } from "@discord/hooks";
import { useLocation } from "@solidjs/router";
import { Component, Show, onMount } from "solid-js";

export const Login: Component = () => {
	const api = useApi();
	const discord = useDiscord();
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
		discord?.authorizeAndAuthenticate();
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
