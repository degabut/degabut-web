import { A } from "@components/A";
import { IS_DESKTOP } from "@constants";
import { useApi } from "@hooks/useApi";
import * as runtime from "@runtime";
import { useLocation, useNavigate } from "@solidjs/router";
import { Component, onCleanup, onMount } from "solid-js";

export const Login: Component = () => {
	const api = useApi();
	const navigate = useNavigate();
	const location = useLocation();

	onMount(() => {
		api.authManager.resetAccessToken();

		const redirect = new URLSearchParams(location.search).get("re");
		if (redirect && redirect !== "/login") localStorage.setItem("redirect", redirect);

		if (IS_DESKTOP) {
			runtime.EventsOnce("oauth", (token: string) => {
				api.authManager.setAccessToken(token);
				navigate("/app/queue");
			});
		}
	});

	onCleanup(() => {
		if (IS_DESKTOP) runtime.EventsOff("oauth");
	});

	return (
		<div class="flex items-center justify-center h-full">
			<div class="flex-col-center sm:bg-neutral-900 bg-transparent sm:px-16 sm:py-24 rounded-2xl">
				<img src="/android-chrome-512x512.png" class="w-32 h-32" />
				<div class="text-4xl font-brand mt-6 font-semibold">degabut</div>
				<div class="mt-24">
					<A
						href={import.meta.env.VITE_OAUTH_URL}
						class="border border-neutral-100 px-8 py-2 rounded-full text-lg text-center hover:bg-white/10 transition-colors"
					>
						Login with Discord
					</A>
				</div>
			</div>
		</div>
	);
};
