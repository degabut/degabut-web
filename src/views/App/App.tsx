import { AppProvider, useApp } from "@providers/AppProvider";
import { BotSelectorProviders } from "@providers/BotSelectorProvider";
import { DesktopProvider } from "@providers/DesktopProvider";
import { QueueProvider } from "@providers/QueueProvider";
import { SettingsProvider } from "@providers/SettingsProvider";
import { Outlet } from "@solidjs/router";
import { requestNotificationPermission } from "@utils/notification";
import { Component, ErrorBoundary, Show } from "solid-js";
import { AppDrawer, AppHeader, BottomBar, Error, MemberListDrawer } from "./components";

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
		<div
			class="flex flex-col h-full"
			classList={{ "bg-gradient-to-b from-neutral-800 to-neutral-900": !app.isFullscreen() }}
		>
			<div class="flex h-full overflow-y-auto">
				<Show when={!app.isFullscreen()}>
					<AppDrawer />
				</Show>

				<div class="relative h-full grow flex flex-col overflow-hidden">
					<Show when={!app.isFullscreen()}>
						<div class="shrink-0">
							<AppHeader />
						</div>
					</Show>

					<div class="h-full overflow-y-auto">
						<Outlet />
					</div>
				</div>

				<Show when={!app.isFullscreen()}>
					<MemberListDrawer />
				</Show>
			</div>

			<Show when={!app.isFullscreen()}>
				<BottomBar />
			</Show>
		</div>
	);
};
