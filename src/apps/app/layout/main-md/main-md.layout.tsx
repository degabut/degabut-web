import { AppRoutes } from "@app/routes";
import { resizable } from "@common";
import { useSettings } from "@settings";
import { useMatch } from "@solidjs/router";
import { Show, type ParentComponent } from "solid-js";
import { AppDrawer, NowPlayingDrawer, QueuePlayer } from "./components";

resizable;

export const MainMd: ParentComponent = (props) => {
	const { settings } = useSettings();
	const match = useMatch(() => AppRoutes.Player);

	return (
		<div class="p-2 flex flex-col h-full space-y-2">
			<div class="flex h-full overflow-hidden space-x-2">
				<AppDrawer />

				<div class="relative h-full w-full overflow-y-auto">{props.children}</div>

				<Show when={!settings["app.player.minimized"] && !match()}>
					<NowPlayingDrawer />
				</Show>
			</div>

			<Show when={settings["app.player.minimized"]}>
				<QueuePlayer />
			</Show>
		</div>
	);
};
