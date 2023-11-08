import { useApp } from "@app/hooks";
import { AppProvider } from "@app/providers";
import { useScreen } from "@common/hooks";
import { NotificationUtil } from "@common/utils";
import { breakpoints } from "@constants";
import { DesktopProvider } from "@desktop/providers";
import { QueueProvider } from "@queue/providers";
import { SettingsProvider } from "@settings/providers";
import { Outlet } from "@solidjs/router";
import { Component, ErrorBoundary, Show, createEffect, createSignal } from "solid-js";
import { AppDrawer, AppHeader, BottomBar, Error, ExternalTrackAdder } from "./components";

export const App: Component = () => {
	return (
		<ErrorBoundary fallback={(err) => <Error error={err} />}>
			<SettingsProvider>
				<QueueProvider>
					<AppProvider>
						<DesktopProvider>
							<ProvidedApp />
						</DesktopProvider>
					</AppProvider>
				</QueueProvider>
			</SettingsProvider>
		</ErrorBoundary>
	);
};

const ProvidedApp: Component = () => {
	const app = useApp();
	NotificationUtil.requestPermission();

	let previousWidth = window.screenX;

	const screen = useScreen();
	const [isDrawerOpen, setIsDrawerOpen] = createSignal(window.innerWidth > breakpoints.md);

	createEffect(() => {
		if (screen.gte.md) setIsDrawerOpen(true);
		if (window.innerWidth <= breakpoints.md && previousWidth > breakpoints.md) setIsDrawerOpen(false);
		previousWidth = window.innerWidth;
	});

	return (
		<>
			<div
				class="flex flex-col h-full"
				classList={{ "bg-neutral-850 md:space-y-2 md:p-1.5": !app.isFullscreen() }}
			>
				<div class="flex h-full overflow-y-auto md:space-x-2">
					<Show when={!app.isFullscreen()}>
						<AppDrawer isOpen={isDrawerOpen()} handleClose={() => setIsDrawerOpen(false)} />
					</Show>

					<div class="relative h-full grow flex flex-col overflow-hidden">
						<Show when={!app.isFullscreen()}>
							<div class="shrink-0">
								<AppHeader onMenuClick={() => setIsDrawerOpen(true)} />
							</div>
						</Show>

						<div
							class="h-full overflow-y-auto "
							classList={{ "md:rounded-lg bg-neutral-950": !app.isFullscreen() }}
						>
							<Outlet />
						</div>
					</div>
				</div>

				<Show when={!app.isFullscreen()}>
					<BottomBar />
				</Show>
			</div>

			<ExternalTrackAdder />
		</>
	);
};
