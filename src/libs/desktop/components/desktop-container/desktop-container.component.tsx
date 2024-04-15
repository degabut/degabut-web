import { IS_DESKTOP } from "@constants";
import { Show, type ParentComponent } from "solid-js";

export const DesktopContainer: ParentComponent = (props) => {
	return (
		<div class="bg-neutral-850 h-full" classList={{ "pt-8": IS_DESKTOP }}>
			<Show when={IS_DESKTOP}>
				<div
					class="absolute h-8 top-0 left-0 w-full z-50 bg-neutral-850"
					style={{ "-webkit-app-region": "drag" }}
				/>
			</Show>
			{props.children}
		</div>
	);
};
