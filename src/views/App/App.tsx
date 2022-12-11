import { RouterLink } from "@components/A";
import { Container } from "@components/Container";
import { Text } from "@components/Text";
import { AppProvider } from "@providers/AppProvider";
import { QueueProvider } from "@providers/QueueProvider";
import { RPCProvider } from "@providers/RPCProvider";
import { SettingsProvider } from "@providers/SettingsProvider";
import { requestNotificationPermission } from "@utils";
import { Outlet } from "solid-app-router";
import { Component, ErrorBoundary } from "solid-js";
import { AppDrawer, AppHeader, BackgroundLogo, BottomBar, MemberListDrawer } from "./components";

export const App: Component = () => {
	return (
		<SettingsProvider>
			<QueueProvider>
				<AppProvider>
					<RPCProvider>
						<ProvidedApp />
					</RPCProvider>
				</AppProvider>
			</QueueProvider>
		</SettingsProvider>
	);
};

const Error: Component<{ error: unknown }> = (props) => {
	const copyToClipboard = () => navigator.clipboard.writeText(props.error as string);

	// eslint-disable-next-line solid/reactivity
	console.log(props.error);
	return (
		<Container extraClass="pt-32">
			<Text.H1 class="text-9xl">:(</Text.H1>

			<div class="flex flex-col text-xl pt-16 space-y-4">
				<Text.H3>Something went wrong, check console for error details.</Text.H3>

				<RouterLink class="underline underline-offset-2" href="/">
					<Text.Body1>Go back</Text.Body1>
				</RouterLink>

				<Text.Caption2 class="hover:underline underline-offset-2 cursor-pointer" onClick={copyToClipboard}>
					Copy Error to Clipboard
				</Text.Caption2>
			</div>
		</Container>
	);
};

const ProvidedApp: Component = () => {
	requestNotificationPermission();

	return (
		<div class="flex flex-col h-full">
			<div class="flex h-full overflow-y-auto">
				<AppDrawer />

				<div class="relative h-full grow flex flex-col overflow-hidden">
					<div class="shrink-0">
						<AppHeader />
					</div>

					<BackgroundLogo />

					<ErrorBoundary fallback={(err) => <Error error={err} />}>
						<div class="h-full overflow-y-auto">
							<Outlet />
						</div>
					</ErrorBoundary>
				</div>

				<MemberListDrawer />
			</div>

			<BottomBar />
		</div>
	);
};
