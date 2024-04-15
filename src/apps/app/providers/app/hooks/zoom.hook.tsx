import { useSettings } from "@settings";
import { createEffect } from "solid-js";

export const useZoom = () => {
	const { settings } = useSettings();

	createEffect(() => {
		document.documentElement.style.fontSize = `${settings["app.textSize"]}px`;
	});
};
