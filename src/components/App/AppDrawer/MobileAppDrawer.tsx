import { useLocation } from "solid-app-router";
import { Component, Show } from "solid-js";
import { MobileLink } from "./MobileLink";
import { NowPlayingMobile } from "./NowPlayingMobile";

export const MobileAppDrawer: Component = () => {
	const location = useLocation();

	return (
		<div class="flex flex-col w-full h-full">
			<Show when={location.pathname !== "/app/queue"}>
				<NowPlayingMobile />
			</Show>

			<div class="flex-row-center flex-wrap bg-black h-full">
				<MobileLink icon="degabutThin" label="Queue" path="/app/queue" />
				<MobileLink icon="search" label="Search" path="/app/search" />
				<MobileLink icon="heart" label="For You" path="/app/recommendation" />
			</div>
		</div>
	);
};
