import { DesktopContainer } from "@desktop";
import type { ParentComponent } from "solid-js";
import { AppDrawer, QueuePlayer } from "./components";

export const MainMd: ParentComponent = (props) => {
	return (
		<DesktopContainer>
			<div class="space-y-2 p-1.5 flex flex-col h-full">
				<div class="flex h-full overflow-hidden md:space-x-2">
					<AppDrawer />

					<div class="relative h-full w-full grow flex flex-col overflow-y-auto">{props.children}</div>
				</div>

				<QueuePlayer />
			</div>
		</DesktopContainer>
	);
};
