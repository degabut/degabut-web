import { useCatJam } from "@app/providers/app/hooks";
import { useDesktop } from "@desktop";
import { useSettings } from "@settings";
import { Match, Switch, createEffect, createSignal, on, onMount, type ParentComponent } from "solid-js";
import { Main } from "./main";
import { Passive } from "./passive";

export const DesktopOverlayLayout: ParentComponent = (props) => {
	const desktop = useDesktop();
	const { settings } = useSettings();
	const [previewOverlay, setPreviewOverlay] = createSignal(false);
	useCatJam({ enabled: () => settings["overlay.catJam.enabled"] && !desktop?.state.isMainWindowFocused });
	let previewTimeout: NodeJS.Timeout | null = null;

	onMount(() => {
		desktop?.ipc.emit?.("overlay-ready");
	});

	createEffect(
		on(
			() => [
				settings["overlay.nowPlaying.enabled"],
				settings["overlay.nowPlaying.opacity"],
				settings["overlay.nowPlaying.position"],
				settings["overlay.nowPlaying.size"],
			],
			() => {
				if (!settings["overlay.nowPlaying.enabled"]) return;
				if (previewTimeout) clearTimeout(previewTimeout);
				previewTimeout = setTimeout(() => setPreviewOverlay(false), 3000);
				setPreviewOverlay(true);
			}
		)
	);

	return (
		<Switch>
			<Match when={desktop?.state.isOverlayOpen}>
				<Main {...props} />
			</Match>
			<Match
				when={
					previewOverlay() || (settings["overlay.nowPlaying.enabled"] && !desktop?.state.isMainWindowFocused)
				}
			>
				<Passive />
			</Match>
		</Switch>
	);
};
