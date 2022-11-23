import { App } from "@components/App";
import { AppProvider } from "@providers/AppProvider";
import { ContextMenuProvider } from "@providers/ContextMenuProvider";
import { QueueProvider } from "@providers/QueueProvider";
import { requestPermission } from "@utils";
import { Outlet, useLocation, useNavigate } from "solid-app-router";
import { Component, onMount } from "solid-js";

export const RootApp: Component = () => {
	return (
		<AppProvider>
			<ContextMenuProvider>
				<QueueProvider>
					<ProvidedApp />
				</QueueProvider>
			</ContextMenuProvider>
		</AppProvider>
	);
};

const ProvidedApp: Component = () => {
	const navigate = useNavigate();
	const location = useLocation();

	onMount(() => {
		requestPermission();
		if (location.pathname === "/app") navigate("/app/queue");
	});

	return (
		<>
			<div class="flex flex-col md:flex-row h-full">
				<App.Drawer />

				<div class="relative h-full flex-grow flex flex-col overflow-x-hidden">
					<div class="flex-shrink-0">
						<App.Header />
					</div>

					<App.BackgroundLogo />

					<div class="h-full overflow-y-auto py-8 px-3 md:px-8 pb-32">
						<Outlet />
					</div>

					<div class="md:hidden relative block w-full z-10">
						<App.MobileDrawer />
					</div>
				</div>

				<App.MemberListDrawer />
			</div>

			<App.CatJamManager />
			<App.QuickAddModal />
		</>
	);
};
