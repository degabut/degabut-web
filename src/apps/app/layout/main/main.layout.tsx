import { useApp } from "@app/hooks";
import { AppRoutes } from "@app/routes";
import { useQueue } from "@queue";
import { useMatch } from "@solidjs/router";
import { Show, createSignal, type ParentComponent } from "solid-js";
import { AppDrawer } from "../main-md/components";
import { AppHeader, NavigationBar, QueueNowPlaying } from "./components";

export const Main: ParentComponent = (props) => {
	const queue = useQueue();
	const app = useApp();
	const inPlayer = useMatch(() => AppRoutes.Player);

	const [isDrawerOpen, setIsDrawerOpen] = createSignal(false);

	return (
		<div class="flex flex-col h-full">
			<div class="flex h-full overflow-hidden">
				<AppDrawer isOpen={isDrawerOpen()} handleClose={() => setIsDrawerOpen(false)} />

				<div class="relative h-full w-full grow flex flex-col overflow-hidden">
					<Show when={app.title()}>
						<div class="shrink-0">
							<AppHeader onMenuClick={() => setIsDrawerOpen(true)} />
						</div>
					</Show>

					<div class="relative h-full overflow-y-auto">{props.children}</div>
				</div>
			</div>

			<div class="flex flex-col w-full">
				<Show when={!inPlayer() && !queue.data.empty}>
					<QueueNowPlaying />
				</Show>
				<NavigationBar />
			</div>
		</div>
	);
};
