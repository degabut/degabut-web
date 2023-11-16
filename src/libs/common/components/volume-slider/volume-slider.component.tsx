import { Button, Icon, Slider } from "@common/components";
import { Component, createEffect, createSignal } from "solid-js";

type VolumeSliderProps = {
	onVolumeChange: (volume: number) => void;
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
		<div class="flex flex-row space-x-2 mx-auto items-center justify-center">
			<Button
				flat
				class="w-9 h-9"
				classList={{
					"p-1.5": volumeLevel() > 100,
					"p-2.5": volumeLevel() <= 100,
				}}
				onClick={() => setIsMuted((v) => !v)}
			>
				<Icon
					name={
						isMuted() || volumeLevel() === 0
							? "soundOff"
							: volumeLevel() > 0 && volumeLevel() <= 100
							? "soundMedium"
							: "soundFull"
					}
					extraClass="fill-neutral-300"
					extraClassList={{
						"w-4 h-4": volumeLevel() <= 100 || isMuted(),
						"w-[1.25rem] h-[1.05rem]": volumeLevel() > 100,
					}}
				/>
			</Button>
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
