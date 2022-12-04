import { Component } from "solid-js";

export const BackgroundLogo: Component = () => {
	return (
		<div class="absolute -right-[4rem] opacity-[7.5%] -z-[1000] touch-none pointer-events-none">
			<img src="/img/bg.png" class="h-screen object-cover" />
		</div>
	);
};
