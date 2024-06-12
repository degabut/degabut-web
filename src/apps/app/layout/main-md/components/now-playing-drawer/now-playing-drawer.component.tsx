import { Container, resizable } from "@common";
import { useSettings } from "@settings";
import { Show, type Component } from "solid-js";
import { NowPlayingController, VerticalNowPlayingController } from "../../../../components";

resizable;

export const NowPlayingDrawer: Component = () => {
	let dragHandler!: HTMLDivElement;
	const breakpoint = 128;
	const { settings, setSettings } = useSettings();

	return (
		<div
			class="shrink-0  max-w-3xl"
			style={{ width: `${settings["app.player.size"]}px` }}
			classList={{
				"min-w-96": settings["app.player.size"] > breakpoint,
				"min-w-16": settings["app.player.size"] <= breakpoint,
			}}
			use:resizable={{
				dragHandler,
				onResize: (w) => setSettings("app.player.size", w),
				position: "left",
			}}
		>
			<Container
				size="full"
				padless
				centered
				extraClass="w-full relative flex flex-row shrink-0 flex-row-center h-full"
				extraClassList={{
					"px-6 pb-12": settings["app.player.size"] > breakpoint,
					"px-1.5": settings["app.player.size"] <= breakpoint,
				}}
			>
				<div
					ref={dragHandler}
					class="absolute top-0 h-full shrink w-2 border-neutral-500 cursor-col-resize select-none"
					classList={{
						"left-0 hover:border-l": true,
					}}
				/>
				<Show when={settings["app.player.size"] <= breakpoint} fallback={<NowPlayingController />}>
					<VerticalNowPlayingController />
				</Show>
			</Container>
		</div>
	);
};
