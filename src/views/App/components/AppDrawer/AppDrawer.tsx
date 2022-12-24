import { Drawer } from "@components/Drawer";
import { useScreen } from "@hooks/useScreen";
import { useSettings } from "@hooks/useSettings";
import { useApp } from "@providers/AppProvider";
import { Component, For } from "solid-js";
import { BotSelector } from "./components";
import { Link } from "./Link";

export const AppDrawer: Component = () => {
	const app = useApp();
	const { settings, setSettings } = useSettings();
	const screen = useScreen();

	const onLinkClick = () => {
		if (screen.lte.sm) app.setIsMenuOpen(false);
	};

	const links = [
		{ icon: "degabutThin", label: "Queue", path: "/app/queue" },
		{ icon: "search", label: "Search", path: "/app/search" },
		{ icon: "audioPlaylist", label: "Playlist", path: "/app/playlist" },
		{ icon: "heart", label: "For You", path: "/app/recommendation" },
	] as const;

	return (
		<Drawer
			resizeable
			extraContainerClass="min-w-[4.25rem] max-w-[75vw] md:max-w-sm pb-8"
			initialSize={settings.appDrawerSize}
			onResize={(appDrawerSize) => setSettings({ appDrawerSize })}
			isOpen={app.isMenuOpen()}
			handleClose={() => app.setIsMenuOpen(false)}
		>
			{(size) => {
				const minimized = size <= 120;

				return (
					<div class="flex flex-col mx-2 h-full">
						<BotSelector minimized={minimized} />

						<div class="flex flex-col grow text-lg space-y-1.5">
							<For each={links}>
								{(link) => <Link {...link} onClick={onLinkClick} minimized={minimized} />}
							</For>
						</div>

						<Link
							icon="gear"
							label="Settings"
							path="/app/settings"
							onClick={onLinkClick}
							minimized={minimized}
						/>
					</div>
				);
			}}
		</Drawer>
	);
};
