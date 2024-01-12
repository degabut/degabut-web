import { Slider, Text } from "@common/components";
import { TimeUtil } from "@common/utils";
import { Component, createEffect, createSignal } from "solid-js";

type Props = {
	max: number;
	value: number;
	disabled?: boolean;
	onChange: (value: number) => void;
};

export const QueueSeekSlider: Component<Props> = (props) => {
	let isSeeking = false;
	const [value, setValue] = createSignal(0);

	createEffect(() => {
		if (props.value > -1 && !isSeeking && !props.disabled) setValue(props.value);
	});

	const backgroundStyle = () => {
		const percentage = (Math.round(props.value) / props.max) * 100;
		const primary = props.disabled ? "#B8AE14" : "#ECE350";
		return `linear-gradient(to right, ${primary} 0%, ${primary} ${percentage}%, rgb(82 82 82) ${percentage}%, rgb(82 82 82) 100%)`;
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
		<div class="w-full text-xs space-y-3 md:space-y-2.5">
			<div class="flex-row-center justify-between" classList={{ invisible: props.max <= 0 }}>
				<Text.Caption2 light>{TimeUtil.secondsToTime(Math.round(value()))}</Text.Caption2>
				<Text.Caption2 light>{TimeUtil.secondsToTime(props.max)}</Text.Caption2>
			</div>

			<div class="flex items-center relative w-full">
				<div
					class="absolute w-full h-0.5"
					classList={{
						"opacity-100 block bg-neutral-800": props.max <= 0,
						"hidden md:block bg-neutral-600 opacity-100 hover:opacity-0": props.max > 0,
					}}
				>
					<div
						class="absolute w-full bg-brand-500 h-0.5 max-w-full"
						style={{ width: `${props.max > 0 ? (value() / props.max) * 100 : 0}%` }}
					/>
				</div>

				<Slider
					class="absolute md:opacity-0 hover:opacity-100 w-full h-0.5 appearance-none accent-brand-600"
					classList={{ "!opacity-0": props.max <= 0 }}
					style={{ background: backgroundStyle() }}
					disabled={props.disabled}
					min={0}
					tooltip={(v) => TimeUtil.secondsToTime(Math.round(v))}
					onInput={(v) => onInput(+v.currentTarget.value)}
					onChange={(v) => onChange(+v.currentTarget.value)}
					max={props.max}
					value={value()}
				/>
			</div>
		</div>
	);
};
