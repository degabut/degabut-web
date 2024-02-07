import { useQueueNotification } from "@app/hooks";
import { AppProvider } from "@app/providers";
import { useScreen } from "@common/hooks";
import { NotificationProvider } from "@common/providers";
import { NotificationUtil } from "@common/utils";
import { breakpoints } from "@constants";
import { useRichPresence } from "@desktop/hooks";
import { useQueue } from "@queue/hooks";
import { QueueProvider } from "@queue/providers";
import { Outlet, useMatch } from "@solidjs/router";
import { SpotifyProvider } from "@spotify/providers";
import { Component, ErrorBoundary, Show, createEffect, createSignal } from "solid-js";
import {
	AppDrawer,
	AppHeader,
	Error,
	ExternalTrackAdder,
	NavigationBar,
	QueueNowPlaying,
	QueuePlayer,
} from "./components";

export const App: Component = () => {
	return (
		<ErrorBoundary fallback={(err) => <Error error={err} />}>
			<NotificationProvider>
				<QueueProvider>
					<AppProvider>
						<SpotifyProvider>
							<ProvidedApp />
						</SpotifyProvider>
					</AppProvider>
				</QueueProvider>
			</NotificationProvider>
		</ErrorBoundary>
	);
};

const ProvidedApp: Component = () => {
	const screen = useScreen();
	const queue = useQueue();
	const inQueue = useMatch(() => (screen.gte.md ? "/queue" : "/queue/player"));

	useQueueNotification();
	useRichPresence(queue);
	NotificationUtil.requestPermission();

	let previousWidth = window.screenX;

	const [isDrawerOpen, setIsDrawerOpen] = createSignal(window.innerWidth > breakpoints.md);

	createEffect(() => {
		if (screen.gte.md) setIsDrawerOpen(true);
		if (window.innerWidth <= breakpoints.md && previousWidth > breakpoints.md) setIsDrawerOpen(false);
		previousWidth = window.innerWidth;
	});

	return (
		<>
			<div class="md:space-y-2 md:p-1.5 flex flex-col h-full">
				<div class="flex h-full overflow-y-auto md:space-x-2">
					<AppDrawer isOpen={isDrawerOpen()} handleClose={() => setIsDrawerOpen(false)} />

					<div class="relative h-full grow flex flex-col overflow-hidden">
						<div class="shrink-0">
							<AppHeader onMenuClick={() => setIsDrawerOpen(true)} />
						</div>

						<div class="h-full overflow-y-auto">
							<Outlet />
						</div>
					</div>
				</div>

				<div class="w-full z-10">
					<div class="hidden md:block">
						<QueuePlayer />
					</div>

					<div class="md:hidden flex flex-col">
						<Show when={!inQueue() && !queue.data.empty}>
							<QueueNowPlaying />
						</Show>
						<NavigationBar />
					</div>
				</div>
			</div>

			<ExternalTrackAdder />
		</>
	);
};
