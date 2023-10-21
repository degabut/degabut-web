import { Text } from "@components/atoms";
import { Container } from "@components/templates";
import { IS_DESKTOP } from "@constants";
import { useFullscreen } from "@hooks/useFullscreen";
import { Navigate, Outlet, useBeforeLeave } from "@solidjs/router";
import { Component } from "solid-js";
import { NavigationCard } from "./components";

export const DesktopOverlay: Component = () => {
	// eslint-disable-next-line solid/components-return-once
	if (!IS_DESKTOP) return <Navigate href="/app" />;

	useFullscreen();

	useBeforeLeave((e) => {
		if (!e.to.toString().match("/app/[0-9]+/desktop-overlay") && IS_DESKTOP) e.preventDefault();
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
