import { Slider } from "@components/Slider";
import { Text } from "@components/Text";
import { secondsToTime } from "@utils";
import { Component, createEffect, createSignal } from "solid-js";

type Props = {
	max: number;
	value: number;
	onChange: (value: number) => void;
};

export const SeekSlider: Component<Props> = (props) => {
	let isSeeking = false;
	const [value, setValue] = createSignal(0);

	createEffect(() => {
		if (props.value > -1 && !isSeeking) setValue(props.value);
	});

	const backgroundStyle = () => {
		const percentage = (props.value / props.max) * 100;
		return `linear-gradient(to right, #ECE350 0%, #ECE350 ${percentage}%, #dedede ${percentage}%, #dedede 100%)`;
	};

	const onChange = (value: number) => {
		props.onChange(value);
		isSeeking = false;
	};

	const onInput = (value: number) => {
		isSeeking = true;
		setValue(value);
	};

	return (
		<div class="px-2 w-full text-xs">
			<div class="flex-row-center justify-between">
				<Text.Caption2 light>{secondsToTime(Math.round(value()))}</Text.Caption2>
				<Text.Caption2 light>{secondsToTime(props.max)}</Text.Caption2>
			</div>

			<Slider
				class="w-full h-0.5 appearance-none accent-brand-600"
				style={{
					background: backgroundStyle(),
				}}
				min={0}
				onInput={(v) => onInput(+v.currentTarget.value)}
				onChange={(v) => onChange(+v.currentTarget.value)}
				max={props.max}
				value={value()}
			/>
		</div>
	);
};