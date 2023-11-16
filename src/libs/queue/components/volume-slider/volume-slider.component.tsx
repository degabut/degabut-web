import { Button, IconSize, Slider } from "@common/components";
import { Component, createEffect, createSignal } from "solid-js";

type VolumeSliderProps = {
	onVolumeChange: (volume: number) => void;
	extraButtonClass?: string;
	iconSize?: IconSize;
};

export const VolumeSlider: Component<VolumeSliderProps> = (props) => {
	const [volumeLevel, setVolumeLevel] = createSignal(25);
	const [isMuted, setIsMuted] = createSignal(false);

	const onVolumeChange = (e: Event) => {
		setIsMuted(false);
		const value = +(e.target as HTMLInputElement).value;
		setVolumeLevel(value);
	};

	createEffect(() => {
		props.onVolumeChange?.(isMuted() ? 0 : volumeLevel());
	});

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
				onClick={() => setIsMuted((v) => !v)}
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
