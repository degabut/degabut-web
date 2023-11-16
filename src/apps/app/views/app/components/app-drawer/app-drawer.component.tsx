import { useApp } from "@app/hooks";
import { Drawer } from "@common/components";
import { useScreen } from "@common/hooks";
import { useDesktop } from "@desktop/hooks";
import { useSettings } from "@settings/hooks";
import { Component, For, Show, createSignal, onMount } from "solid-js";
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
	const [deferredPrompt, setDeferredPrompt] = createSignal<BeforeInstallPromptEvent | null>(null);

	const onLinkClick = () => {
		if (screen.lte.sm) props.handleClose();
	};

	const links = [
		{ icon: "degabutThin", label: "Queue", path: "/queue" },
		{ icon: "search", label: "Search", path: "/search" },
		{ icon: "audioPlaylist", label: "Playlist", path: "/playlist" },
		{ icon: "heart", label: "For You", path: "/recommendation" },
	] as const;

	onMount(() => {
		window.addEventListener("beforeinstallprompt", (e) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		});
	});

	const promptInstall = async () => {
		const prompt = deferredPrompt();
		if (!prompt) return;

		await prompt.prompt();
		setDeferredPrompt(null);
	};

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
						</div>

						<div class="flex flex-col space-y-1.5">
							<Show when={deferredPrompt()}>
								<Link icon="plus" label="Install" minimized={minimized} onClick={promptInstall} />
							</Show>

							<Show when={desktop?.isUpdateReady()}>
								<Link
									icon="download"
									label="Update"
									highlight
									minimized={minimized}
									onClick={() =>
										app.setConfirmation({
											title: "Update Available",
											message: "Restart to apply the update?",
											onConfirm: () => desktop?.ipc.quitAndInstallUpdate(),
										})
									}
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
