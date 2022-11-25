import { Component } from "solid-js";
import { MobileLink } from "./MobileLink";
import { NowPlayingMobile } from "./NowPlayingMobile";

export const MobileAppDrawer: Component = () => {
	return (
		<div class="flex flex-col w-full h-full">
			<NowPlayingMobile />

			<div class="flex-row-center flex-wrap bg-black h-full">
				<MobileLink icon="degabutThin" label="Queue" path="/app/queue" />
				<MobileLink icon="search" label="Search" path="/app/search" />
				<MobileLink icon="heart" label="For You" path="/app/recommendation" />
			</div>
		</div>
	);
};
