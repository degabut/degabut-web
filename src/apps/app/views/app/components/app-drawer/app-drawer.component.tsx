import { useSettings } from "@app/hooks";
import { Drawer } from "@common/components";
import { useScreen } from "@common/hooks";
import { Component, For, Show, createSignal, onMount } from "solid-js";
import { BotSelector, Link } from "./components";

type AppDrawerProps = {
	isOpen: boolean;
	handleClose: () => void;
};

export const AppDrawer: Component<AppDrawerProps> = (props) => {
	const { settings, setSettings } = useSettings();
	const screen = useScreen();
	const [deferredPrompt, setDeferredPrompt] = createSignal<BeforeInstallPromptEvent | null>(null);

	const onLinkClick = () => {
		if (screen.lte.sm) props.handleClose();
	};

	const links = [
		{ icon: "degabutThin", label: "Queue", path: "/app/queue" },
		{ icon: "search", label: "Search", path: "/app/search" },
		{ icon: "audioPlaylist", label: "Playlist", path: "/app/playlist" },
		{ icon: "heart", label: "For You", path: "/app/recommendation" },
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
					<div class="flex flex-col h-full">
						<BotSelector minimized={minimized} />

						<div class="flex flex-col grow text-lg space-y-1.5">
							<For each={links}>
								{(link) => <Link {...link} onClick={onLinkClick} minimized={minimized} />}
							</For>
						</div>

						<Show when={deferredPrompt()}>
							<Link icon="plus" label="Install" minimized={minimized} onClick={promptInstall} />
						</Show>

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
