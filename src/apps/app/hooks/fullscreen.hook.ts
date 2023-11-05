import { onCleanup, onMount } from "solid-js";
import { useApp } from "./app.hook";

export const useFullscreen = () => {
	const app = useApp();

	onMount(() => {
		app.setIsFullscreen(true);
	});

	onCleanup(() => {
		app.setIsFullscreen(false);
	});
};
