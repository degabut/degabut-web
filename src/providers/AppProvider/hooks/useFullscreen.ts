import { useApp } from "@providers/AppProvider";
import { onCleanup, onMount } from "solid-js";

export const useFullscreen = () => {
	const app = useApp();

	onMount(() => {
		app.setIsFullscreen(true);
	});

	onCleanup(() => {
		app.setIsFullscreen(false);
	});
};
