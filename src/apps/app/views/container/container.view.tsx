import { IS_DESKTOP } from "@constants";
import { Outlet } from "@solidjs/router";
import { Show } from "solid-js";

export const Container = () => {
	return (
		<div class="bg-neutral-850 h-full" classList={{ "pt-8": IS_DESKTOP }}>
			<Show when={IS_DESKTOP}>
				<div
					class="absolute h-8 top-0 left-0 w-full z-50 bg-neutral-850"
					style={{ "-webkit-app-region": "drag" }}
				/>
			</Show>
			<Outlet />
		</div>
	);
};
