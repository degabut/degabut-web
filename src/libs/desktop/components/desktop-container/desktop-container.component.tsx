import { DelayUtil } from "@common";
import { IS_DESKTOP } from "@constants";
import { Show, createSignal, onMount, type ParentComponent } from "solid-js";

export const DesktopContainer: ParentComponent = (props) => {
	const [size, setSize] = createSignal("2rem");

	const updateSize = DelayUtil.throttle(() => {
		const basePadding = 2;
		const zoomLevel = window.devicePixelRatio;
		const adjustedPadding = basePadding / zoomLevel;
		setSize(`${adjustedPadding}rem`);
	}, 250);

	onMount(() => {
		if (!IS_DESKTOP) return;

		updateSize();
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	});

	return (
		<div class="bg-neutral-850 h-full" style={{ "padding-top": IS_DESKTOP ? size() : undefined }}>
			<Show when={IS_DESKTOP}>
				<div
					class="absolute top-0 left-0 w-full z-[1000] bg-neutral-850"
					style={{ "-webkit-app-region": "drag", height: size() }}
				/>
			</Show>
			{props.children}
		</div>
	);
};
