import { Container } from "@components/Container";
import { RouterLink } from "@components/Link";
import { AppProvider } from "@providers/AppProvider";
import { QueueProvider } from "@providers/QueueProvider";
import { RPCProvider } from "@providers/RPCProvider";
import { requestPermission } from "@utils";
import { Outlet } from "solid-app-router";
import { Component, ErrorBoundary } from "solid-js";
import {
	AppDrawer,
	AppHeader,
	BackgroundLogo,
	CatJamManager,
	ExternalDragDrop,
	InstallPrompt,
	MemberListDrawer,
	MobileAppDrawer,
	UpdateModal,
} from "./components";

export const App: Component = () => {
	return (
		<QueueProvider>
			<AppProvider>
				<RPCProvider>
					<ProvidedApp />
				</RPCProvider>
			</AppProvider>
		</QueueProvider>
	);
};

const Error: Component<{ error: unknown }> = (props) => {
	// eslint-disable-next-line solid/reactivity
	console.log(props.error);
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
};

const ProvidedApp: Component = () => {
	requestPermission();

	return (
		<>
			<div class="flex flex-col md:flex-row h-full ">
				<AppDrawer />

				<div class="relative h-full flex-grow flex flex-col overflow-x-hidden">
					<div class="flex-shrink-0">
						<AppHeader />
					</div>

					<BackgroundLogo />

					<div class="h-full overflow-y-auto">
						<ErrorBoundary fallback={(err) => <Error error={err} />}>
							<Outlet />
						</ErrorBoundary>
					</div>

					<div class="md:hidden block w-full z-10">
						<MobileAppDrawer />
					</div>
				</div>

				<MemberListDrawer />
			</div>

			<CatJamManager />
			<ExternalDragDrop />
			<InstallPrompt />
			<UpdateModal />
		</>
	);
};
