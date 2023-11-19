import { A } from "@common/components";
import { useApi } from "@common/hooks";
import { OAUTH_URL } from "@constants";
import { useDesktop } from "@desktop/hooks";
import { Component, onMount } from "solid-js";

export const Login: Component = () => {
	const api = useApi();
	const desktop = useDesktop();

	onMount(() => {
		if (api.authManager.hasAccessToken()) {
			api.authManager.resetAccessToken();
			desktop?.ipc.onLoggedOut?.();
		}
	});

	return (
		<div class="flex items-center justify-center h-full">
			<div class="flex-col-center sm:bg-neutral-900 bg-transparent sm:px-16 sm:py-24 rounded-2xl">
				<img src="/android-chrome-512x512.png" class="w-32 h-32" />
				<div class="text-4xl font-brand mt-6 font-semibold">degabut</div>
				<div class="mt-24">
					<A
						href={OAUTH_URL}
						class="border border-neutral-100 px-8 py-2 rounded-full text-lg text-center hover:bg-white/10 transition-colors"
					>
						Login with Discord
					</A>
				</div>
			</div>
		</div>
	);
};
