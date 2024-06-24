import { Button, Slider, type IconSize } from "@common";
import { createSignal, type Component } from "solid-js";

type VolumeSliderProps = {
	value: number;
	onChange: (value: number) => void;
	onMuteToggled: (isMuted: boolean) => void;
	extraContainerClass?: string;
	extraButtonClass?: string;
	iconSize?: IconSize;
};

export const VolumeSlider: Component<VolumeSliderProps> = (props) => {
	const [isMuted, setIsMuted] = createSignal(false);

	const onVolumeChange = (e: Event) => {
		setIsMuted(false);
		const value = +(e.target as HTMLInputElement).value;

		props.onChange(value);
	};

	const onMuteToggle = () => {
		setIsMuted((v) => !v);
		props.onMuteToggled(isMuted());
	};

	return (
		<div
			class="flex flex-row items-center justify-center w-full h-full space-x-1"
			classList={{ [props.extraContainerClass || ""]: !!props.extraContainerClass }}
		>
			<Button
				flat
				class="p-2"
				icon={
					isMuted() || props.value === 0
						? "soundOff"
						: props.value > 0 && props.value <= 100
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
				step={1}
				tooltip
				value={isMuted() ? 0 : props.value}
				onInput={onVolumeChange}
				class="h-1 w-full accent-brand-600"
			/>
		</div>
	);
};
