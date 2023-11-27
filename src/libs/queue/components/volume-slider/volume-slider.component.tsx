import { Button, IconSize, Slider } from "@common/components";
import { useDesktop } from "@desktop/hooks";
import { useQueue } from "@queue/hooks";
import { useSettings } from "@settings/hooks";
import { Component, createSignal, onMount } from "solid-js";

type VolumeSliderProps = {
	extraButtonClass?: string;
	iconSize?: IconSize;
};

export const VolumeSlider: Component<VolumeSliderProps> = (props) => {
	const desktop = useDesktop();
	const queue = useQueue();
	const { settings, setSettings } = useSettings();
	const [isMuted, setIsMuted] = createSignal(false);

	const volumeLevel = () => settings.botVolumes[queue.bot().id];

	onMount(() => {
		desktop?.ipc?.setBotVolume?.(volumeLevel(), queue.bot().id);
	});

	const onVolumeChange = (e: Event) => {
		setIsMuted(false);
		const value = +(e.target as HTMLInputElement).value;

		setSettings("botVolumes", { [queue.bot().id]: value });
		desktop?.ipc?.setBotVolume?.(value, queue.bot().id);
	};

	const onMuteToggle = () => {
		setIsMuted((v) => !v);
		desktop?.ipc?.setBotVolume?.(isMuted() ? 0 : volumeLevel(), queue.bot().id);
	};

	return (
		<div class="flex flex-row space-x-2 items-center justify-center">
			<Button
				flat
				class="p-2"
				icon={
					isMuted() || volumeLevel() === 0
						? "soundOff"
						: volumeLevel() > 0 && volumeLevel() <= 100
						? "soundMedium"
						: "soundFull"
				}
				iconSize={props.iconSize || "md"}
				classList={{ [props.extraButtonClass || ""]: !!props.extraButtonClass }}
				onClick={onMuteToggle}
			/>
			<Slider
				min={0}
				max={200}
				value={isMuted() ? 0 : volumeLevel()}
				onInput={onVolumeChange}
				class="h-1 w-24 accent-brand-600"
			/>
		</div>
	);
};
