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
			<div class="space-y-2 p-1.5 flex flex-col h-full">
				<div class="flex h-full overflow-hidden md:space-x-2">
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
