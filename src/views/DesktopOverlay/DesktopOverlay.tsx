import { Container } from "@components/Container";
import { Text } from "@components/Text";
import { IS_DESKTOP } from "@constants";
import { useFullscreen } from "@providers/AppProvider";
import { Outlet, useBeforeLeave, useNavigate } from "@solidjs/router";
import { Component, onMount } from "solid-js";
import { NavigationCard } from "./components";

export const DesktopOverlay: Component = () => {
	useFullscreen();
	const navigate = useNavigate();

	onMount(() => {
		if (!import.meta.env.DEV && !IS_DESKTOP) {
			navigate("/app");
		}
	});

	useBeforeLeave((e) => {
		if (!e.to.toString().startsWith("/app/desktop-overlay") && IS_DESKTOP) e.preventDefault();
	});

	return (
		<Container size="full" padless extraClass="flex-col-center space-y-6 h-full bg-black/50">
			<div class="flex-row-center justify-center space-x-4 bg-black/90 w-full py-6">
				<img class="w-10 h-10" src="/android-chrome-512x512.png" />
				<Text.H1 class="text-3xl font-brand font-extrabold">degabut</Text.H1>
			</div>

			<div class="flex flex-row space-x-6 h-[32rem] max-w-[86rem] min-h-0 w-full p-2">
				<NavigationCard />
				<div class="grow">
					<Outlet />
				</div>
			</div>
		</Container>
	);
};
