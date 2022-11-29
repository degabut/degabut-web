import { App } from "@components/App";
import { Container } from "@components/Container";
import { RouterLink } from "@components/Link";
import { AppProvider } from "@providers/AppProvider";
import { ContextMenuProvider } from "@providers/ContextMenuProvider";
import { QueueProvider } from "@providers/QueueProvider";
import { RPCProvider } from "@providers/RPCProvider";
import { requestPermission } from "@utils";
import { Outlet, useLocation, useNavigate } from "solid-app-router";
import { Component, ErrorBoundary, onMount } from "solid-js";

export const RootApp: Component = () => {
	return (
		<AppProvider>
			<ContextMenuProvider>
				<QueueProvider>
					<RPCProvider>
						<ProvidedApp />
					</RPCProvider>
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
			<div class="flex flex-col md:flex-row h-full ">
				<App.Drawer />

				<div class="relative h-full flex-grow flex flex-col overflow-x-hidden">
					<div class="flex-shrink-0">
						<App.Header />
					</div>

					<App.BackgroundLogo />

					<div class="h-full overflow-y-auto">
						<ErrorBoundary
							fallback={(err) => {
								console.log(err);
								return (
									<Container extraClass="pt-32">
										<div class="text-9xl">:(</div>
										<div class="flex flex-col text-xl pt-16 space-y-4">
											<div>Something went wrong, check console for error details.</div>
											<RouterLink class="underline underline-offset-2" href="/">
												Go back
											</RouterLink>
										</div>
									</Container>
								);
							}}
						>
							<Outlet />
						</ErrorBoundary>
					</div>

					<div class="md:hidden block w-full z-10">
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
