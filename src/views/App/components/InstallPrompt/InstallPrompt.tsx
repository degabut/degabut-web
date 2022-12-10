import { Button } from "@components/Button";
import { Divider } from "@components/Divider";
import { Component, createSignal, onMount, Show } from "solid-js";

export const InstallPrompt: Component = () => {
	const [deferredPrompt, setDeferredPrompt] = createSignal<BeforeInstallPromptEvent | null>(null);

	onMount(() => {
		window.addEventListener("beforeinstallprompt", (e) => {
			e.preventDefault();
			const latestPrompt = localStorage.getItem("latest_prompt");
			const twelveHours = 1000 * 60 * 60 * 12;
			if (latestPrompt && +latestPrompt + twelveHours > Date.now()) return;
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		});
	});

	const promptInstall = () => {
		const prompt = deferredPrompt();
		if (!prompt) return;

		prompt.prompt();
		setDeferredPrompt(null);
	};

	const dismiss = () => {
		setDeferredPrompt(null);
		localStorage.setItem("latest_prompt", Date.now().toString());
	};

	return (
		<Show when={deferredPrompt()}>
			<div class="fixed md:right-4 md:bottom-4 bottom-0 flex-col-center w-full md:max-w-xs space-y-4 rounded bg-gray-800 z-50 p-4">
				<div class="flex-row-center space-x-3">
					<img src="/favicon-32x32.png" alt="" />
					<div class="text-lg font-medium ">Install Degabut</div>
				</div>

				<Divider />

				<div class="text-center">Install Degabut on your device for a better experience.</div>

				<div class="flex flex-row items-center space-x-8 py-2">
					<Button flat class="px-4 py-1.5 underline underline-offset-2" onClick={dismiss}>
						Later
					</Button>
					<Button class="px-4 py-1.5" onClick={promptInstall}>
						Install
					</Button>
				</div>
			</div>
		</Show>
	);
};
