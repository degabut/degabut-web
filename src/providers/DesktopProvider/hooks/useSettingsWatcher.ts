import { useSettings } from "@hooks/useSettings";
import { createEffect, on } from "solid-js";
import { postMessage } from "../poster";

export const useSettingsWatcher = () => {
	const { settings } = useSettings();

	const watchedSettings = () => ({
		discordRpc: settings.discordRpc,
		overlay: settings.overlay,
		overlayShortcut: settings.overlayShortcut,
	});

	createEffect(
		on(watchedSettings, (after, before) => {
			for (const [key, value] of Object.entries(after)) {
				if (!before || value !== before[key as keyof typeof before]) {
					const afterValue = value !== Object(value) ? value : JSON.parse(JSON.stringify(value));
					const beforeValue = before
						? before !== Object(before)
							? before
							: JSON.parse(JSON.stringify(before[key as keyof typeof before]))
						: undefined;

					postMessage("settings-changed", key, afterValue, beforeValue);
				}
			}
		})
	);
};
