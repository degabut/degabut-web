import { Button, Container, resizable } from "@common";
import { useSettings } from "@settings";
import { Show, type Component } from "solid-js";
import { MinimizedNowPlayingController, NowPlayingController } from "../../../../components";

resizable;

export const NowPlayingDrawer: Component = () => {
	let dragHandler!: HTMLDivElement;
	const breakpoint = 128;
	const { settings, setSettings } = useSettings();

	return (
		<div
			class="shrink-0 max-w-3xl"
			style={{ width: `${settings["app.player.size"]}px` }}
			classList={{
				"min-w-[22.5rem]": settings["app.player.size"] > breakpoint,
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
				extraClass="w-full relative flex-row-center shrink-0 h-full"
				extraClassList={{
					"p-8 pt-4": settings["app.player.size"] > breakpoint,
					"pb-2 px-1.5 bg-black": settings["app.player.size"] <= breakpoint,
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
					<MinimizedNowPlayingController />
				</Show>

				<Button
					flat
					title="Minimize"
					icon="chevronDown"
					iconSize="sm"
					onClick={() => setSettings("app.player.minimized", true)}
					class="justify-center py-1 absolute bottom-0 left-0 w-full text-neutral-500 border-t border-t-neutral-850"
				/>
			</Container>
		</div>
	);
};
