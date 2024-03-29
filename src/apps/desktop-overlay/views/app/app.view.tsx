import { Container, Text } from "@common/components";
import { useShortcut } from "@common/hooks";
import { IS_DESKTOP } from "@constants";
import { useQueue } from "@queue/hooks";
import { QueueProvider } from "@queue/providers";
import { Navigate, Outlet, useBeforeLeave, useNavigate } from "@solidjs/router";
import { Component } from "solid-js";
import { NavigationCard } from "./components";

export const App: Component = () => {
	return (
		<QueueProvider>
			<ProvidedApp />
		</QueueProvider>
	);
};

const ProvidedApp: Component = () => {
	// eslint-disable-next-line solid/components-return-once
	if (!IS_DESKTOP) return <Navigate href="/app" />;

	const queue = useQueue();
	const navigate = useNavigate();

	useShortcut({
		shortcuts: [
			{
				key: "k",
				ctrl: true,
				handler: () => navigate("/desktop-overlay/search"),
			},
		],
	});

	useBeforeLeave((e) => {
		if (!e.to.toString().startsWith("/desktop-overlay")) e.preventDefault();
	});

	return (
		<Container size="full" padless transparent extraClass="flex-col-center space-y-6 h-full bg-black/50">
			<div class="flex-row-center justify-center space-x-4 bg-black/90 w-full py-5">
				<img class="w-12 h-12" src={queue.bot().iconUrl} />
				<Text.H1 class="text-3xl font-brand font-black tracking-wide">{queue.bot().name}</Text.H1>
			</div>

			<div class="flex flex-row space-x-6 h-[32rem] max-w-[86rem] min-h-0 w-full p-2">
				<NavigationCard />
				<div class="grow">
					<Outlet />
				</div>
			</div>
		</Container>
	);
};
