import { AppProvider, useApp } from "@providers/AppProvider";
import { BotSelectorProviders } from "@providers/BotSelectorProvider";
import { DesktopProvider } from "@providers/DesktopProvider";
import { QueueProvider } from "@providers/QueueProvider";
import { SettingsProvider } from "@providers/SettingsProvider";
import { Outlet } from "@solidjs/router";
import { requestNotificationPermission } from "@utils/notification";
import { Component, ErrorBoundary, Show } from "solid-js";
import { AppDrawer, AppHeader, BottomBar, Error } from "./components";

export const App: Component = () => {
	return (
		<ErrorBoundary fallback={(err) => <Error error={err} />}>
			<SettingsProvider>
				<BotSelectorProviders>
					<QueueProvider>
						<AppProvider>
							<DesktopProvider>
								<ProvidedApp />
							</DesktopProvider>
						</AppProvider>
					</QueueProvider>
				</BotSelectorProviders>
			</SettingsProvider>
		</ErrorBoundary>
	);
};

const ProvidedApp: Component = () => {
	const app = useApp();
	requestNotificationPermission();

	return (
		<div class="flex flex-col h-full" classList={{ "bg-neutral-850 md:space-y-2 md:p-1.5": !app.isFullscreen() }}>
			<div class="flex h-full overflow-y-auto md:space-x-2">
				<Show when={!app.isFullscreen()}>
					<AppDrawer />
				</Show>

				<div class="relative h-full grow flex flex-col overflow-hidden">
					<Show when={!app.isFullscreen()}>
						<div class="shrink-0">
							<AppHeader />
						</div>
					</Show>

					<div
						class="h-full overflow-y-auto bg-neutral-950"
						classList={{ "md:rounded-lg": !app.isFullscreen() }}
					>
						<Outlet />
					</div>
				</div>
			</div>

			<Show when={!app.isFullscreen()}>
				<BottomBar />
			</Show>
		</div>
	);
};
