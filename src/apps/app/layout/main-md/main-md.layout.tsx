import { resizable } from "@common";
import { DesktopContainer } from "@desktop";
import { useSettings } from "@settings";
import { Show, type ParentComponent } from "solid-js";
import { AppDrawer, NowPlayingDrawer, QueuePlayer } from "./components";

resizable;

export const MainMd: ParentComponent = (props) => {
	const { settings } = useSettings();

	return (
		<DesktopContainer>
			<div class="p-2 flex flex-col h-full space-y-2">
				<div class="flex h-full overflow-hidden space-x-2">
					<AppDrawer />

					<div class="relative h-full w-full overflow-y-auto">{props.children}</div>

					<Show when={!settings["app.player.minimized"]}>
						<NowPlayingDrawer />
					</Show>
				</div>

				<Show when={settings["app.player.minimized"]}>
					<QueuePlayer />
				</Show>
			</div>
		</DesktopContainer>
	);
};
