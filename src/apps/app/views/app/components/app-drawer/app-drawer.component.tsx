import { useApp } from "@app/hooks";
import { Drawer } from "@common/components";
import { useScreen } from "@common/hooks";
import { RecapUtil } from "@common/utils";
import { useDesktop } from "@desktop/hooks";
import { useSettings } from "@settings/hooks";
import { Component, For, Show } from "solid-js";
import { BotSelector, Link } from "./components";

type AppDrawerProps = {
	isOpen: boolean;
	handleClose: () => void;
};

export const AppDrawer: Component<AppDrawerProps> = (props) => {
	const app = useApp();
	const { settings, setSettings } = useSettings();
	const screen = useScreen();
	const desktop = useDesktop();

	desktop?.ipc.onLoggedOut?.();

	const onLinkClick = () => {
		if (!screen.gte.md) props.handleClose();
	};

	const links = [
		{ icon: "degabutThin", label: "Queue", path: "/queue" },
		{ icon: "search", label: "Search", path: "/search" },
		{ icon: "audioPlaylist", label: "Playlist", path: "/playlist" },
		{ icon: "heart", label: "For You", path: "/recommendation" },
	] as const;

	return (
		<Drawer
			resizable
			extraContainerClass="min-w-[4.25rem] max-w-[75vw] md:max-w-[max(16vw,16rem)] pb-8 rounded-lg"
			initialSize={settings["app.drawerSize"]}
			onResize={(drawerSize) => setSettings("app.drawerSize", drawerSize)}
			isOpen={props.isOpen}
			handleClose={() => props.handleClose()}
		>
			{(size) => {
				const minimized = size <= 120;

				return (
					<div class="flex flex-col h-full space-y-1.5">
						<BotSelector minimized={minimized} />

						<div class="flex flex-col grow text-lg space-y-1.5">
							<For each={links}>
								{(link) => <Link {...link} onClick={onLinkClick} minimized={minimized} />}
							</For>

							<Show when={RecapUtil.getYear()} keyed>
								{(year) => (
									<Link
										minimized={minimized}
										icon="stars"
										highlight
										label={`Recap ${year}`}
										onClick={() => {
											const win = window.open("/recap");
											win?.focus();
										}}
									/>
								)}
							</Show>
						</div>

						<div class="flex flex-col space-y-1.5">
							<Show when={desktop?.isUpdateReady() || app.hasNewVersion()}>
								<Link
									icon={desktop?.isUpdateReady() ? "download" : "reload"}
									label={desktop?.isUpdateReady() ? "Update" : "Reload"}
									highlight
									minimized={minimized}
									onClick={() => {
										if (desktop?.isUpdateReady()) {
											app.setConfirmation({
												title: "Update Available",
												message: "Restart to apply the update?",
												onConfirm: () => desktop?.ipc.quitAndInstallUpdate?.(),
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
								path="/settings"
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
