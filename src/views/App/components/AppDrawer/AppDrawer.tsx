import { Divider } from "@components/Divider";
import { Drawer } from "@components/Drawer";
import { Icon } from "@components/Icon";
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
			initialSize={settings.appDrawerSize}
			onResize={(appDrawerSize) => setSettings({ appDrawerSize })}
			isOpen={app.isMenuOpen()}
			handleClose={() => app.setIsMenuOpen(false)}
		>
			{(size) => {
				const minimized = size <= 120;
				return (
					<>
						<Show
							when={!minimized}
							fallback={
								<div class="flex justify-center py-8">
									<img class="w-8 h-auto" src="/favicon-32x32.png" />
								</div>
							}
						>
							<Icon
								name="musicNote"
								extraClass="w-24 h-24 fill-white/10 pointer-events-none absolute top-0 left-2"
							/>
							<div class="px-6 font-brand font-semibold text-3xl truncate py-8">degabut</div>
						</Show>

						<div class="flex-grow text-lg mx-2 space-y-1.5">
							<For each={links}>
								{(link) => <Link {...link} onClick={onLinkClick} minimized={minimized} />}
							</For>
						</div>

						<div class="space-y-2 pb-8 mx-2">
							<Show when={size > 220}>
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
					</>
				);
			}}
		</Drawer>
	);
};
