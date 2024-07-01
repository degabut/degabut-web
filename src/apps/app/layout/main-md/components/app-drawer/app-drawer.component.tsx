import { useApp } from "@app/providers";
import { AppRoutes } from "@app/routes";
import { Drawer, RecapUtil, useScreen, type Icons } from "@common";
import { SPOTIFY_CLIENT_ID } from "@constants";
import { useDesktop } from "@desktop";
import { RecapRoutes } from "@recap/routes";
import { useSettings } from "@settings";
import { For, Show, type Component } from "solid-js";
import { BotSelector, Link } from "./components";

type LinkItem = {
	icon: Icons;
	activeIcon?: Icons;
	label: string;
	highlight?: boolean;
	disabled?: boolean;
} & ({ path: string } | { onClick: () => void });

type AppDrawerProps = {
	isOpen?: boolean;
	handleClose?: () => void;
};

export const AppDrawer: Component<AppDrawerProps> = (props) => {
	const app = useApp()!;
	const { settings, setSettings } = useSettings();
	const screen = useScreen();
	const desktop = useDesktop();

	const onLinkClick = () => {
		if (!screen.gte.md) props.handleClose?.();
	};

	const links = (): LinkItem[] => [
		{ icon: "degabutThin", label: "Queue", path: AppRoutes.Queue },
		{ icon: "search", label: "Search", path: AppRoutes.Search },
		{ icon: "heartLine", activeIcon: "heart", label: "Liked", path: AppRoutes.Liked },
		{ icon: "playlistMusicLine", activeIcon: "playlistMusic", label: "Playlist", path: AppRoutes.Playlists },
		{ icon: "libraryMusicLine", activeIcon: "libraryMusic", label: "For You", path: AppRoutes.Recommendation },
		{
			icon: "spotify",
			label: "Spotify",
			path: AppRoutes.Spotify,
			disabled: !SPOTIFY_CLIENT_ID && !settings["spotify.enabled"],
		},
		{
			icon: "stars",
			label: `Recap ${RecapUtil.getYear()}`,
			onClick: () => window.open(RecapRoutes.Recap)?.focus(),
			highlight: true,
			disabled: !RecapUtil.getYear(),
		},
	];

	return (
		<Drawer
			resizable
			extraContainerClass="min-w-[4.25rem] max-w-[75vw] md:max-w-[max(16vw,16rem)] pb-8 rounded-lg"
			initialSize={settings["app.drawerSize"]}
			onResize={(drawerSize) => setSettings("app.drawerSize", drawerSize)}
			isOpen={props.isOpen === undefined ? true : props.isOpen}
			handleClose={() => props.handleClose?.()}
		>
			{(size) => {
				const minimized = size <= 120;

				return (
					<div class="flex flex-col h-full space-y-1.5">
						<BotSelector minimized={minimized} />

						<div class="flex flex-col grow text-lg space-y-1.5">
							<For each={links().filter((l) => !l.disabled)}>
								{(link) => (
									<Link
										{...link}
										onClick={"onClick" in link ? link.onClick : onLinkClick}
										minimized={minimized}
									/>
								)}
							</For>
						</div>

						<div class="flex flex-col space-y-1.5">
							<Show when={desktop?.state.isUpdateReady || app.hasNewVersion()}>
								<Link
									icon={desktop?.state.isUpdateReady ? "download" : "reload"}
									label={desktop?.state.isUpdateReady ? "Update" : "Reload"}
									highlight
									minimized={minimized}
									onClick={() => {
										if (desktop?.state.isUpdateReady) {
											app.setConfirmation({
												title: "Update Available",
												message: "Restart to apply the update?",
												onConfirm: () => desktop?.ipc.send?.("quit-and-install-update"),
											});
										} else {
											window.location.reload();
										}
									}}
								/>
							</Show>

							<Link
								icon="gear"
								label="Settings"
								path={AppRoutes.Settings}
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
