import { useApp } from "@app/providers";
import { Button, Container, Divider, Text } from "@common";
import { defaultQueue, useQueue } from "@queue";
import { createMemo, For, onMount, Show, type Accessor, type Component } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { SliderItem, SwitchItem, type SliderItemProps } from "./components";

type FiltersCategory = {
	label: string;
	enabled: boolean;
	verticalItems?: boolean;
	onEnableToggled?: () => void;
	items: SliderItemProps[];
};

export const Filters: Component = () => {
	const app = useApp()!;
	const queue = useQueue()!;
	const [currentFilters, setCurrentFilters] = createStore(structuredClone(unwrap(queue.data.filtersState)));

	onMount(() => app.setTitle("Filters"));

	const hasChanged = createMemo(() => JSON.stringify(queue.data.filtersState) !== JSON.stringify(currentFilters));

	const categories: Accessor<FiltersCategory[]> = () => {
		const categories: FiltersCategory[] = [
			{
				label: "Timescale",
				enabled: currentFilters.timescale.enabled,
				onEnableToggled: () => setCurrentFilters("timescale", { enabled: !currentFilters.timescale.enabled }),
				items: [
					{
						label: "Speed",
						value: () => currentFilters.timescale.speed,
						onInput: (v) => setCurrentFilters("timescale", { speed: v }),
						max: 2,
						min: 0.05,
						step: 0.05,
					},
					{
						label: "Pitch",
						value: () => currentFilters.timescale.pitch,
						onInput: (v) => setCurrentFilters("timescale", { pitch: v }),
						max: 2,
						min: 0.05,
						step: 0.05,
					},
					{
						label: "Rate",
						value: () => currentFilters.timescale.rate,
						onInput: (v) => setCurrentFilters("timescale", { rate: v }),
						max: 2,
						min: 0.05,
						step: 0.05,
					},
				],
			},
			{
				label: "Tremolo",
				enabled: currentFilters.tremolo.enabled,
				onEnableToggled: () => setCurrentFilters("tremolo", "enabled", !currentFilters.tremolo.enabled),
				items: [
					{
						label: "Frequency",
						value: () => currentFilters.tremolo.frequency,
						onInput: (v) => setCurrentFilters("tremolo", "frequency", v),
						max: 5,
						min: 0.05,
						step: 0.05,
					},
					{
						label: "Depth",
						value: () => currentFilters.tremolo.depth,
						onInput: (v) => setCurrentFilters("tremolo", "depth", v),
						max: 1,
						min: 0.05,
						step: 0.05,
					},
				],
			},
			{
				label: "Vibrato",
				enabled: currentFilters.vibrato.enabled,
				onEnableToggled: () => setCurrentFilters("vibrato", { enabled: !currentFilters.vibrato.enabled }),
				items: [
					{
						label: "Frequency",
						value: () => currentFilters.vibrato.frequency,
						onInput: (v) => setCurrentFilters("vibrato", { frequency: v }),
						max: 5,
						min: 0.05,
						step: 0.05,
					},
					{
						label: "Depth",
						value: () => currentFilters.vibrato.depth,
						onInput: (v) => setCurrentFilters("vibrato", { depth: v }),
						max: 1,
						min: 0.05,
						step: 0.05,
					},
				],
			},
			{
				label: "Rotation",
				enabled: currentFilters.rotation.enabled,
				onEnableToggled: () => setCurrentFilters("rotation", { enabled: !currentFilters.rotation.enabled }),
				items: [
					{
						label: "Frequency",
						value: () => currentFilters.rotation.rotationHz,
						onInput: (v) => setCurrentFilters("rotation", { rotationHz: v }),
						max: 5,
						min: 0.05,
						step: 0.05,
					},
				],
			},
		];

		if (queue.bot().lavalinkFilterPlugins?.includes("LavaDSPX-Plugin")) {
			categories.push({
				label: "Echo",
				enabled: currentFilters.pluginFilters.echo.enabled,
				onEnableToggled: () =>
					setCurrentFilters("pluginFilters", "echo", {
						enabled: !currentFilters.pluginFilters?.echo?.enabled,
					}),
				items: [
					{
						label: "Echo Length",
						value: () => currentFilters.pluginFilters.echo.echoLength,
						onInput: (v) => setCurrentFilters("pluginFilters", "echo", { echoLength: v }),
						max: 1,
						min: 0.01,
						step: 0.01,
					},
					{
						label: "Decay",
						value: () => currentFilters.pluginFilters.echo.decay,
						onInput: (v) => setCurrentFilters("pluginFilters", "echo", { decay: v }),
						max: 1,
						min: 0.05,
						step: 0.05,
					},
				],
			});
		}

		return categories;
	};

	const onSet = () => {
		queue.setFilters(currentFilters);
	};

	const reset = () => {
		setCurrentFilters(structuredClone(defaultQueue.filtersState));
	};

	const cancel = () => {
		setCurrentFilters(structuredClone(unwrap(queue.data.filtersState)));
	};

	return (
		<Container size="sm" centered>
			<div class="flex flex-col space-y-8">
				<div class="space-y-2 md:space-y-4">
					<Text.H4 class="uppercase font-medium text-neutral-400">Equalizer</Text.H4>
					<SwitchItem
						label="Enabled"
						value={() => currentFilters.equalizer.enabled}
						onInput={(v) => setCurrentFilters("equalizer", { enabled: v })}
					/>
					<div class="flex-row-center justify-between overflow-auto space-x-1.5">
						<For each={currentFilters.equalizer.bands}>
							{(band, i) => (
								<SliderItem
									label={`${i()}`}
									value={() => band.gain}
									vertical
									disabled={!currentFilters.equalizer.enabled}
									onInput={(v) => setCurrentFilters("equalizer", "bands", i(), "gain", v)}
									min={-0.25}
									max={1}
									step={0.05}
								/>
							)}
						</For>
					</div>
				</div>

				<Divider dark />

				<For each={categories()}>
					{(c) => (
						<>
							<div class="space-y-2 md:space-y-4">
								<Text.H4 class="uppercase font-medium text-neutral-400">{c.label}</Text.H4>
								<SwitchItem label="Enabled" value={() => c.enabled} onInput={c.onEnableToggled} />
								<For each={c.items}>{(i) => <SliderItem {...i} disabled={!c.enabled} />}</For>
							</div>

							<Divider dark />
						</>
					)}
				</For>

				<div class="space-y-2.5">
					<Text.Caption2 class="max-w-64" classList={{ "!text-brand-500": !!hasChanged() }}>
						Filter will be applied a few seconds after pressing the Set button, please wait.
					</Text.Caption2>
					<div class="flex flex-row justify-between">
						<div class="flex flex-row space-x-4">
							<Button disabled={!hasChanged()} class="px-4 py-1" onClick={onSet}>
								Set
							</Button>

							<Show when={hasChanged()}>
								<Button class="px-4 py-1" onClick={cancel}>
									Cancel
								</Button>
							</Show>
						</div>
						<Button flat class="px-4 py-1" onClick={reset}>
							Reset
						</Button>
					</div>
				</div>
			</div>
		</Container>
	);
};
