import { RouterLink } from "@components/A";
import { Divider } from "@components/Divider";
import { Drawer } from "@components/Drawer";
import { useApp } from "@hooks/useApp";
import { useScreen } from "@hooks/useScreen";
import { useSettings } from "@hooks/useSettings";
import { Component, For, Show } from "solid-js";
import { Link } from "./Link";
import { MinimizedNowPlaying, NowPlaying } from "./NowPlaying";

export const AppDrawer: Component = () => {
	const app = useApp();
	const { settings, setSettings } = useSettings();
	const screen = useScreen();

	const onLinkClick = () => {
		if (screen().lte.sm) app.setIsMenuOpen(false);
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
			extraContainerClass="min-w-[4.25rem] max-w-[75vw] md:max-w-sm"
			initialSize={settings.appDrawerSize}
			onResize={(appDrawerSize) => setSettings({ appDrawerSize })}
			isOpen={app.isMenuOpen()}
			handleClose={() => app.setIsMenuOpen(false)}
		>
			{(size) => {
				const minimized = size <= 120;

				return (
					<div class="flex flex-col mx-2 h-full">
						<RouterLink
							href="/app/queue"
							class="flex"
							classList={{
								"justify-center py-8": minimized,
								"px-2.5 py-4": !minimized,
							}}
						>
							<img class="hover:animate-pulse w-8 h-auto" src="/favicon-32x32.png" />
						</RouterLink>

						<div class="flex flex-col grow text-lg space-y-1.5">
							<For each={links}>
								{(link) => <Link {...link} onClick={onLinkClick} minimized={minimized} />}
							</For>
						</div>

						<div class="flex flex-col space-y-2 pb-8">
							<Show when={size > 180}>
								<NowPlaying />
								<Divider dark extraClass="hidden md:block" />
							</Show>

							<Show when={minimized}>
								<MinimizedNowPlaying />
							</Show>

							<Link
								icon="gear"
								label="Settings"
								path="/app/settings"
								onClick={onLinkClick}
								minimized={minimized}
							/>
						</div>
					</div>
				);
			}}
		</Drawer>
	);
};
